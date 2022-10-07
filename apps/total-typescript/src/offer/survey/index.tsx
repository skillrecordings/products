import {useSurveyPopupOfferMachine} from 'offer/use-survey-popup-offer-machine'
import * as React from 'react'
import {track} from '../../utils/analytics'
import {trpc} from '../../utils/trpc'
import {SurveyMachineContext} from './survey-machine'
import {QuestionResource} from '@skillrecordings/types'
import {useRouter} from 'next/router'
import {SurveyPopup} from './survey-popup'
import {surveyConfig} from './survey-config'

export const Survey = ({
  excludePages = ['/confirm'],
}: {
  excludePages?: string[]
}) => {
  const router = useRouter()
  const pathIsValid = !excludePages.includes(router.pathname)
  const answerSurveyMutation = trpc.useMutation(['convertkit.answerSurvey'])
  const {currentOffer, currentOfferId, isPopupOpen, sendToMachine} =
    useSurveyPopupOfferMachine()

  const handlePopupDismissed = async () => {
    track('survey dismissed (do not display)', {
      question: currentOfferId,
    })
    answerSurveyMutation.mutate({
      answer: 'true',
      question: 'do_not_survey',
    })
    sendToMachine('OFFER_DISMISSED')
  }

  const handlePopupClosed = async () => {
    track('survey closed', {
      question: currentOfferId,
    })
    answerSurveyMutation.mutate({
      answer: 'skip',
      question: currentOfferId || `none`,
    })
    sendToMachine('OFFER_CLOSED')
  }

  const handleSubmitAnswer = async (context: SurveyMachineContext) => {
    track('survey answered', {
      question: currentOfferId,
      answer: context.answer,
    })
    answerSurveyMutation.mutate({
      answer: context.answer,
      question: currentOfferId,
    })
    setTimeout(() => sendToMachine('RESPONDED_TO_OFFER'), 750)
  }

  return pathIsValid && currentOffer ? (
    <SurveyPopup
      surveyConfig={surveyConfig}
      currentQuestion={currentOffer as QuestionResource}
      isPopupOpen={isPopupOpen}
      handlePopupDismissed={handlePopupDismissed}
      handlePopupClosed={handlePopupClosed}
      handleSubmitAnswer={handleSubmitAnswer}
    />
  ) : null
}
