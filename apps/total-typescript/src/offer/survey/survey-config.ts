import {QuizResource} from '@skillrecordings/types'
import {dataTypescript2024} from './data-typescript-2024'
import {sortingHat2024} from './sorting-hat-2024'
import {WIZARD_QUIZ_ID} from './wizard-quiz-config'

export const surveyConfig = {
  answerSubmitUrl: process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL,
  afterCompletionMessages: {
    neutral: {
      default: `Thanks!`,
      last: `Thanks!`,
    },
  },
}

export const typescript2024SurveyConfig: SurveyConfig = {
  answerSubmitUrl: process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL,
  afterCompletionMessages: {
    neutral: {
      default: 'Thanks for sharing your TypeScript journey with us!',
      last: 'Thanks for sharing your TypeScript journey with us!',
    },
  },
}
export type SurveyConfig = typeof surveyConfig
export const TYPESCRIPT_2024_SURVEY_ID = 'typescript_2024'

export const surveyData: {[SURVEY_ID: string]: QuizResource} = {
  ask: {
    questions: {
      level: {
        question: `👋 What's your current TypeScript skill level?`,
        type: 'multiple-choice',
        choices: [
          {
            answer: 'beginner',
            label: 'Beginner',
          },
          {
            answer: 'advanced-beginner',
            label: 'Advanced Beginner',
          },
          {
            answer: 'intermediate',
            label: 'Intermediate',
          },
          {
            answer: 'expert',
            label: 'Expert',
          },
          {
            answer: 'wizard',
            label: 'Wizard',
          },
        ],
      },
      ts_at_work: {
        question: `Do you use TypeScript at work?`,
        type: 'multiple-choice',
        choices: [
          {
            answer: 'true',
            label: 'Yes, I use TypeScript at work.',
          },
          {
            answer: 'false',
            label: 'Nope',
          },
        ],
      },
    },
  },
  [TYPESCRIPT_2024_SURVEY_ID]: dataTypescript2024,
  [WIZARD_QUIZ_ID]: sortingHat2024,
}
