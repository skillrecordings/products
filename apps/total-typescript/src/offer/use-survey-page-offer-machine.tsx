import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {useMachine} from '@xstate/react'
import {offerMachine} from './offer-machine'
import * as React from 'react'
import {surveyData} from './survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {SurveyMachineContext} from './survey/survey-machine'

export const useSurveyPageOfferMachine = (
  surveyId: string,
  options?: {
    initialAnswers?: Record<string, string>
    initialState?: string
  },
) => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [machineState, sendToMachine] = useMachine(offerMachine, {
    context: {
      canSurveyAnon: true,
      askAllQuestions: true,
      bypassNagProtection: true,
      surveyId,
      answers: options?.initialAnswers || {},
    },
  })

  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const availableQuestions = surveyData[surveyId].questions

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.debug('state:', machineState.value.toString())
    switch (true) {
      case machineState.matches('loadingSubscriber'):
        if (!loadingSubscriber) {
          sendToMachine('SUBSCRIBER_LOADED', {subscriber: subscriber || null})
        }
        break
      case machineState.matches('loadingCurrentOffer'):
        const questionKeys = Object.keys(availableQuestions)
        let currentIndex = questionKeys.indexOf(
          machineState.context.currentOfferId,
        )
        let nextIndex = currentIndex === -1 ? 0 : currentIndex + 1

        // Find next valid question
        while (nextIndex < questionKeys.length) {
          const nextQuestionId = questionKeys[nextIndex]
          const nextQuestion = availableQuestions[nextQuestionId]

          const dependencyMet =
            !nextQuestion.dependsOn ||
            answers[nextQuestion.dependsOn.question] ===
              nextQuestion.dependsOn.answer

          if (dependencyMet) {
            const processedQuestion =
              typeof nextQuestion.question === 'function'
                ? {
                    ...nextQuestion,
                    question: nextQuestion.question(answers),
                  }
                : nextQuestion

            sendToMachine('CURRENT_OFFER_READY', {
              currentOffer: processedQuestion,
              currentOfferId: nextQuestionId,
            })
            return
          }

          nextIndex++
        }

        sendToMachine('NO_CURRENT_OFFER_FOUND')
        break
    }
  }, [
    subscriber,
    loadingSubscriber,
    machineState,
    sendToMachine,
    availableQuestions,
    answers,
  ])

  const currentQuestion = machineState.context.currentOffer as QuestionResource
  const currentQuestionId = machineState.context.currentOfferId

  const handleSubmitAnswer = async (context: SurveyMachineContext) => {
    let answer = context.answer

    // If the question is an essay, the answer might be an empty string
    // In this case, we'll use the formik values
    if (currentQuestion.type === 'essay' && (!answer || answer === '')) {
      answer = context.answer
    }

    setAnswers((prev) => {
      return {...prev, [context.currentQuestionId]: answer}
    })
  }

  return {
    currentQuestion,
    currentQuestionId,
    isLoading:
      machineState.matches('loadingSubscriber') ||
      machineState.matches('loadingCurrentOffer'),
    isComplete: machineState.matches('offerComplete'),
    isPresenting: machineState.matches('presentingCurrentOffer'),
    sendToMachine,
    handleSubmitAnswer,
    machineState,
    subscriber,
    answers,
  }
}
