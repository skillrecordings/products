import {useConvertkit} from '../hooks/use-convertkit'
import {useMachine} from '@xstate/react'
import {offerMachine} from './offer-machine'
import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import {surveyData} from './survey/survey-config'

const availableQuestions = surveyData.ask.questions

export const useSurveyPopupOfferMachine = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [machineState, sendToMachine] = useMachine(offerMachine)

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('state:', machineState.value.toString())
    switch (true) {
      case machineState.matches('loadingSubscriber'):
        // relies on another hook and using react-query under the hood
        if (subscriber && !loadingSubscriber) {
          sendToMachine('SUBSCRIBER_LOADED', {subscriber})
        } else if (!subscriber && !loadingSubscriber) {
          sendToMachine('NO_SUBSCRIBER_FOUND')
        }
        break
      case machineState.matches('loadingCurrentOffer'):
        // will rely on a hook and use trpc/react-query
        let offerFound = false
        for (const question in availableQuestions) {
          if (subscriber && isEmpty(subscriber.fields[question])) {
            sendToMachine('CURRENT_OFFER_READY', {
              currentOffer: availableQuestions[question],
              currentOfferId: question,
            })
            offerFound = true
            break
          }
        }
        if (!offerFound) sendToMachine('NO_CURRENT_OFFER_FOUND')
        break
    }
  }, [subscriber, loadingSubscriber, machineState, sendToMachine])

  return {
    currentOfferId: machineState.context.currentOfferId,
    currentOffer: machineState.context.currentOffer,
    isPopupOpen: machineState.matches('presentingCurrentOffer'),
    sendToMachine,
  }
}
