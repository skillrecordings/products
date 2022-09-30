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
      struggle: {
        question: `What's your biggest struggle with TypeScript right now?`,
        type: `essay`,
      },
      level: {
        question: `What's your current comfort level with TypeScript?`,
        type: 'multiple-choice',
        choices: [
          {
            answer: 'high',
            label: 'Very comfortable',
          },
          {
            answer: 'medium',
            label: 'Somewhat comfortable',
          },
          {
            answer: 'low',
            label: 'Hardly know the basics',
          },
          {
            answer: 'lowest',
            label: 'What is TypeScript?',
          },
        ],
      },
    },
  },
}
