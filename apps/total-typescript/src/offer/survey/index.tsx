'use client'

import {useSurveyPopupOfferMachine} from 'offer/use-survey-popup-offer-machine'
import * as React from 'react'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {trpc} from '../../trpc/trpc.client'
import {SurveyMachineContext} from './survey-machine'
import {QuestionResource} from '@skillrecordings/types'
import {SurveyPopup} from './survey-popup'
import {surveyConfig} from './survey-config'
import {Identify, identify} from '@amplitude/analytics-browser'
import {usePathname} from 'next/navigation'

export const Survey = ({
  excludePages = ['/confirm', '/workshops', '/buy'],
}: {
  excludePages?: string[]
}) => {
  function isPathValid(path: string | null, excludePages: string[]) {
    for (const pathElement of excludePages) {
      if (path && path.includes(pathElement)) {
        return false
      }
    }
    return true
  }
  const pathname = usePathname()
  const pathIsValid = isPathValid(pathname, excludePages)
  const answerSurveyMutation = trpc.convertkit.answerSurvey.useMutation()
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

    const identity = new Identify()
    identity.set(currentOfferId, context.answer)
    identify(identity)

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
