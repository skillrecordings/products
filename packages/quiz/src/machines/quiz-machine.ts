import {createMachine, assign} from 'xstate'
import {QuestionResource, QuestionSet} from '@skillrecordings/types'
import isArray from 'lodash/isArray'
import every from 'lodash/every'
import shuffle from 'lodash/shuffle'
import isEmpty from 'lodash/isEmpty'
import handleSubmitAnswer from '../utils/submit-answer'
import {QuizConfig} from '../config'

export type QuizEvent =
  | {type: 'ANSWER'; answer: string}
  | {type: 'ANSWERED'}
  | {type: 'LOAD_QUESTION'; currentQuestion: QuestionResource}

export type QuizContext = {
  currentQuestionId: string
  questionSet: QuestionSet
  currentQuestion: QuestionResource
  answer: string
  answeredCorrectly: boolean
  config: QuizConfig
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
                currentQuestion: (_, event) => {
                  const question = event.currentQuestion
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
          onDone: [
            {
              target: 'answered',
              cond: (context) => isEmpty(context.currentQuestion.correct),
            },
            {target: 'answered.correct', cond: 'answeredCorrectly'},
            {target: 'answered.incorrect'},
          ],
          onError: {target: 'failure'},
        },
      },
      answered: {
        type: 'compound',
        initial: 'neutral',
        states: {
          correct: {},
          incorrect: {},
          neutral: {},
        },
      },
      failure: {},
    },
  },
  {
    guards: {
      answeredCorrectly: (context, event) => {
        const hasMultipleCorrectAnswers = isArray(
          context.currentQuestion.correct,
        )
        const allCorrect: any =
          isArray(context.answer) &&
          every(
            context.answer.map((a: string) =>
              context.currentQuestion.correct?.includes(a),
            ),
          )
        return hasMultipleCorrectAnswers
          ? allCorrect
          : context.currentQuestion.correct === context.answer
      },
    },
    services: {
      submitAnswer: (context) => handleSubmitAnswer(context),
    },
  },
)

export default quizMachine
