import {createMachine, assign} from 'xstate'
import {QuestionResource, Questions} from '@skillrecordings/types'
import get from 'lodash/get'
import shuffle from 'lodash/shuffle'
import submitAnswer from '../utils/submit-answer'

export type QuizEvent =
  | {type: 'ANSWER'; answer: string}
  | {type: 'ANSWERED'}
  | {type: 'LOAD_QUESTION'; questionId: string}

export type QuizContext = {
  questionId: string
  questions: Questions
  currentQuestion: QuestionResource
  answer: string
}

const quizMachine = createMachine<QuizContext, QuizEvent>(
  {
    id: 'quizMachine',
    initial: 'initializing',
    states: {
      initializing: {
        on: {
          LOAD_QUESTION: {
            actions: [
              assign({
                currentQuestion: (context, event) => {
                  const question = get(context.questions, event.questionId)
                  const shuffledChoices = shuffle(question.choices)
                  return {...question, choices: shuffledChoices}
                },
              }),
            ],
            target: 'unanswered',
          },
        },
      },
      unanswered: {
        on: {
          ANSWER: {
            actions: assign({
              answer: (_, event) => {
                return event.answer
              },
            }),
            target: 'answering',
          },
        },
      },
      answering: {
        invoke: {
          id: 'submitAnswer',
          src: 'submitAnswer',
          onDone: {
            target: 'answered',
          },
          onError: {target: 'failure'},
        },
      },
      answered: {
        type: 'final',
      },
      failure: {},
    },
  },
  {
    guards: {},
    services: {
      submitAnswer: (context) => submitAnswer(context),
    },
  },
)

export default quizMachine
