import {sortingHat2024} from './sorting-hat-2024'
import {SurveyConfig} from './survey-config'

export const WIZARD_QUIZ_ID = 'wizard_quiz_2024'

export const wizardQuizConfig: SurveyConfig = {
  answerSubmitUrl: process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL,
  afterCompletionMessages: {
    neutral: {
      default: 'Your magical prowess has been assessed...',
      last: 'Your magical prowess has been assessed...',
    },
  },
}
