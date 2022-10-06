import {useConvertkit} from '../hooks/use-convertkit'
import {useMachine} from '@xstate/react'
import {offerMachine} from './offer-machine'
import * as React from 'react'
import {isBefore, subDays} from 'date-fns'
import isEmpty from 'lodash/isEmpty'
import {surveyData} from '../components/survey/survey-config'

const availableQuestions = surveyData.ask.questions

export const useSurveyPopupOfferMachine = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [machineState, sendToMachine] = useMachine(offerMachine)
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('')
  const [isPopupOpen, setIsPopupOpen] = React.useState(true)

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('state:', machineState.value.toString())
    switch (true) {
      case machineState.matches('loadingSubscriber'):
        if (subscriber && !loadingSubscriber) {
          sendToMachine('SUBSCRIBER_LOADED', {subscriber})
        } else if (!subscriber && !loadingSubscriber) {
          sendToMachine('NO_SUBSCRIBER_FOUND')
        }
        break
      case machineState.matches('verifyingOfferEligibility'):
        const lastSurveyDate = new Date(
          subscriber?.fields.last_surveyed_on || 0,
        )
        const DAYS_TO_WAIT_BETWEEN_QUESTIONS = 3
        const thresholdDate = subDays(
          new Date(),
          DAYS_TO_WAIT_BETWEEN_QUESTIONS,
        )
        const canSurvey =
          isBefore(lastSurveyDate, thresholdDate) &&
          subscriber?.fields.do_not_survey !== 'true' &&
          subscriber?.state === 'active'
        if (canSurvey) {
          sendToMachine('OFFER_ELIGIBILITY_VERIFIED')
        }
        break
      case machineState.matches('loadingCurrentOffer'):
        let offerFound = false
        for (const question in availableQuestions) {
          if (subscriber && isEmpty(subscriber.fields[question])) {
            setCurrentQuestion(question)
            sendToMachine('CURRENT_OFFER_READY')
            offerFound = true
            break
          }
        }
        if (!offerFound) sendToMachine('NO_CURRENT_OFFER_FOUND')
        break
      case machineState.matches('acknowledgingDismissal'):
        sendToMachine('DISMISSAL_ACKNOWLEDGED')
        break
      case machineState.matches('processingOfferResponse'):
        sendToMachine('OFFER_COMPLETE')
        break
      case machineState.matches('offerComplete'):
        setIsPopupOpen(false)
        break
    }
  }, [subscriber, loadingSubscriber, machineState, sendToMachine])

  return {
    currentOffer: availableQuestions[currentQuestion],
    isPopupOpen,
    sendToMachine,
  }
}
