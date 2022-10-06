import * as React from 'react'
import {SurveyMachineContext} from '../offer/survey/survey-machine'

import {useSurveyPopupOfferMachine} from '../offer/use-survey-popup-offer-machine'
import {SurveyPopup} from 'offer/components/survey-popup'

const SurveyPage = () => {
  const {currentOffer, isPopupOpen, sendToMachine} =
    useSurveyPopupOfferMachine()

  const handlePopupDismissed = async () => {
    console.log('dismiss')
    sendToMachine('OFFER_DISMISSED')
  }

  const handlePopupClosed = async () => {
    console.log('closed')
    sendToMachine('OFFER_CLOSED')
  }

  const handleSubmitAnswer = async (context: SurveyMachineContext) => {
    console.log('submitted stuff', {context})
    setTimeout(() => sendToMachine('RESPONDED_TO_OFFER'), 1250)
  }

  return currentOffer ? (
    <SurveyPopup
      currentQuestion={currentOffer}
      isPopupOpen={isPopupOpen}
      handlePopupDismissed={handlePopupDismissed}
      handlePopupClosed={handlePopupClosed}
      handleSubmitAnswer={handleSubmitAnswer}
    />
  ) : null
}

export default SurveyPage
