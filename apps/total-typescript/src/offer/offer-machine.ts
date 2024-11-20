import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {Offer} from './offer-types'
import {assign, createMachine, StateMachine} from 'xstate'
import {isBefore, subDays} from 'date-fns'

export type OfferMachineEvent =
  | {type: 'SUBSCRIBER_LOADED'; subscriber: Subscriber}
  | {type: 'NO_SUBSCRIBER_FOUND'}
  | {type: 'OFFER_DISMISSED'}
  | {type: 'OFFER_CLOSED'}
  | {type: 'NOT_ELIGIBLE_FOR_OFFERS'}
  | {type: 'OFFER_ELIGIBILITY_VERIFIED'}
  | {type: 'CURRENT_OFFER_READY'; currentOffer: Offer; currentOfferId: string}
  | {type: 'NO_CURRENT_OFFER_FOUND'}
  | {type: 'RESPONDED_TO_OFFER'}
  | {type: 'POST_OFFER_CTA_AVAILABLE'}
  | {type: 'DISMISSAL_ACKNOWLEDGED'}
  | {type: 'OFFER_COMPLETE'}
  | {type: 'SUBSCRIBED'}
  | {type: 'EMAIL_COLLECTED'}
export type OfferContext = {
  subscriber?: Subscriber
  currentOffer: Offer
  currentOfferId: string
  eligibility?: StateMachine<any, any, any> | null
  canSurveyAnon?: boolean
  askAllQuestions?: boolean
  bypassNagProtection?: boolean
  surveyId?: string
  answers?: Record<string, string>
}

export const offerMachine = createMachine<OfferContext, OfferMachineEvent>(
  {
    id: 'offerMachine',
    initial: 'loadingSubscriber',
    states: {
      loadingSubscriber: {
        on: {
          SUBSCRIBER_LOADED: {
            target: 'verifyingOfferEligibility',
            actions: assign({
              subscriber: (_, event) => {
                return event.subscriber
              },
            }),
          },
          NO_SUBSCRIBER_FOUND: {
            target: 'verifyingOfferEligibility',
          },
        },
      },
      verifyingOfferEligibility: {
        invoke: {
          src: 'verifyEligibility',
          onDone: {target: 'loadingCurrentOffer'},
          onError: {target: 'offerComplete'},
        },
        on: {
          NOT_ELIGIBLE_FOR_OFFERS: {
            target: 'offerComplete',
          },
          OFFER_ELIGIBILITY_VERIFIED: {
            target: 'loadingCurrentOffer',
          },
        },
      },
      loadingCurrentOffer: {
        on: {
          CURRENT_OFFER_READY: {
            target: 'presentingCurrentOffer',
            actions: assign({
              currentOffer: (_, event) => {
                console.log('set currentOffer', event.currentOffer)
                return event.currentOffer
              },
              currentOfferId: (_, event) => {
                console.log('set currentOfferId', event.currentOfferId)
                return event.currentOfferId
              },
            }),
          },
          NO_CURRENT_OFFER_FOUND: [
            {
              target: 'offerComplete',
              cond: (context) => Boolean(context.subscriber),
            },
            {
              target: 'collectEmail',
            },
          ],
        },
      },
      presentingCurrentOffer: {
        on: {
          RESPONDED_TO_OFFER: [
            {
              target: 'loadingCurrentOffer',
              cond: (context) => context.askAllQuestions === true,
            },
            {
              target: 'offerComplete',
            },
          ],
          OFFER_DISMISSED: {
            target: 'offerComplete',
          },
          OFFER_CLOSED: {
            target: 'offerComplete',
          },
        },
      },
      collectEmail: {
        on: {
          EMAIL_COLLECTED: {
            target: 'offerComplete',
          },
        },
      },
      offerComplete: {
        type: 'final',
      },
    },
  },
  {
    services: {
      verifyEligibility: (context, _) =>
        new Promise((resolve, reject) => {
          const {subscriber} = context

          if (!subscriber && context.canSurveyAnon) {
            resolve(true)
          }

          const lastSurveyDate = new Date(
            subscriber?.fields.last_surveyed_on || 0,
          )
          const DAYS_TO_WAIT_BETWEEN_QUESTIONS = 3
          const thresholdDate = subDays(
            new Date(),
            DAYS_TO_WAIT_BETWEEN_QUESTIONS,
          )

          const canSurvey =
            context.bypassNagProtection ||
            (isBefore(lastSurveyDate, thresholdDate) &&
              subscriber?.fields.do_not_survey !== 'true')

          if (canSurvey) {
            resolve(true)
          } else {
            reject()
          }
        }),
    },
  },
)
