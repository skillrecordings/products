import {createMachine, assign} from 'xstate'
import {QuestionResource, QuestionSet} from '@skillrecordings/types'
import isArray from 'lodash/isArray'
import every from 'lodash/every'
import shuffle from 'lodash/shuffle'
import isEmpty from 'lodash/isEmpty'
import {SurveyConfig} from './survey-question'

// Add tracking of all answers for dynamic questions
export type SurveyMachineContext = {
  currentQuestionId: string
  questionSet: QuestionSet
  currentQuestion: QuestionResource
  answer: string
  answeredCorrectly: boolean
  config: SurveyConfig
  allAnswers: Record<string, string> // Track all answers for dynamic questions
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
}

export type SurveyMachineEvent =
  | {type: 'ANSWER'; answer: string}
  | {type: 'ANSWERED'}
  | {
      type: 'LOAD_QUESTION'
      currentQuestion: QuestionResource
      currentQuestionId: string
    }

const evaluateQuestion = (
  question: QuestionResource,
  answers: Record<string, string>,
) => {
  // If the question is a function, evaluate it with current answers
  if (typeof question.question === 'function') {
    return {
      ...question,
      question: question.question(answers),
    }
  }
  return question
}

const loadQuestion = (
  event: {
    type: 'LOAD_QUESTION'
    currentQuestion: QuestionResource
  },
  context: SurveyMachineContext,
) => {
  const question = evaluateQuestion(event.currentQuestion, context.allAnswers)
  console.log('question loading', {question})
  const shuffledChoices =
    question.correct || question.shuffleChoices
      ? shuffle(question.choices)
      : question.choices

  console.log('shuffledChoices', {shuffledChoices})
  return {...question, choices: shuffledChoices}
}

export const surveyMachine = createMachine<
  SurveyMachineContext,
  SurveyMachineEvent
>(
  {
    id: 'quizMachine',
    initial: 'initializing',
    context: {
      currentQuestionId: '',
      questionSet: {},
      currentQuestion: {} as QuestionResource,
      answer: '',
      answeredCorrectly: false,
      config: {} as SurveyConfig,
      allAnswers: {}, // Initialize empty answers object
      handleSubmitAnswer: () => Promise.resolve(),
    },
    states: {
      initializing: {
        on: {
          LOAD_QUESTION: {
            actions: [
              assign({
                currentQuestion: (context, event) =>
                  loadQuestion(event, context),
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
            actions: [
              assign({
                answer: (_, event) => event.answer,
                // Update allAnswers when an answer is provided
                allAnswers: (context, event) => ({
                  ...context.allAnswers,
                  [context.currentQuestionId]: event.answer,
                }),
              }),
            ],
            target: 'answering',
          },
          LOAD_QUESTION: {
            actions: [
              assign({
                currentQuestion: (context, event) =>
                  loadQuestion(event, context),
                currentQuestionId: (_, event) => event.currentQuestionId,
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
      submitAnswer: (context) => {
        console.log('submitAnswer in machine', context)
        return context.handleSubmitAnswer(context)
      },
    },
  },
)
