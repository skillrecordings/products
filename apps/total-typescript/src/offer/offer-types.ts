import {Subscriber} from 'schemas/subscriber'

export type Offer = Record<string, any>

export type Survey = Record<string, SurveyQuestion | string>

export type MultipleChoiceAnswer = {
  answer: string
  label: string
  always_last?: boolean
}

export type SurveyQuestion = {
  heading: string
  subheading: string
  type:
    | 'opt-out'
    | 'cta-email'
    | 'cta-done'
    | 'multiple-choice'
    | 'multi-line'
    | 'cta-link'
  first?: boolean
  random?: boolean
  other?: boolean
  other_label?: string
  choices?: MultipleChoiceAnswer[]
  next?: any
  image?: string
  button_label?: string
  url?: string
  final?: boolean
}

export type SurveyState = {
  subscriber?: Subscriber
  question?: SurveyQuestion
  data: any
  currentQuestionKey: string
  answers: any
  closed: boolean
  surveyTitle: string
}
