import {createMachine, assign} from 'xstate'
import {QuestionResource, QuestionSet} from '@skillrecordings/types'
import isArray from 'lodash/isArray'
import every from 'lodash/every'
import shuffle from 'lodash/shuffle'
import isEmpty from 'lodash/isEmpty'
import {SurveyConfig} from './survey-question'

export type SurveyMachineEvent =
  | {type: 'ANSWER'; answer: string}
  | {type: 'ANSWERED'}
  | {
      type: 'LOAD_QUESTION'
      currentQuestion: QuestionResource
      currentQuestionId: string
    }

export type SurveyMachineContext = {
  currentQuestionId: string
  questionSet: QuestionSet
  currentQuestion: QuestionResource
  answer: string
  answeredCorrectly: boolean
  config: SurveyConfig
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
}

const loadQuestion = (event: {
  type: 'LOAD_QUESTION'
  currentQuestion: QuestionResource
}) => {
  const question = event.currentQuestion
  const shuffledChoices = question.correct
    ? shuffle(question.choices)
    : question.choices
  return {...question, choices: shuffledChoices}
}

export const surveyMachine = createMachine<
  SurveyMachineContext,
  SurveyMachineEvent
>(
  {
    id: 'quizMachine',
    initial: 'initializing',
    states: {
      initializing: {
        on: {
          LOAD_QUESTION: {
            actions: [
              assign({
                currentQuestion: (_, event) => loadQuestion(event),
                currentQuestionId: (_, event) => event.currentQuestionId,
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
          LOAD_QUESTION: {
            actions: [
              assign({
                currentQuestion: (_, event) => loadQuestion(event),
              }),
            ],
            target: 'unanswered',
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
      submitAnswer: (context) => context.handleSubmitAnswer(context),
    },
  },
)
