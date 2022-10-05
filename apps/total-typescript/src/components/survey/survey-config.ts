import {QuizResource} from '@skillrecordings/types'

export const surveyConfig = {
  answerSubmitUrl: process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL,
  afterCompletionMessages: {
    neutral: {
      default: `Thanks!`,
      last: `Thanks!`,
    },
  },
}

export const surveyData: {[SURVEY_ID: string]: QuizResource} = {
  ask: {
    questions: {
      level: {
        question: `What's your TypeScript skill level?`,
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
}
