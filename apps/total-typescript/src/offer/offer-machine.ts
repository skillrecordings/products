import {Subscriber} from 'schemas/subscriber'
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

export type OfferContext = {
  subscriber?: Subscriber
  currentOffer: Offer
  currentOfferId: string
  eligibility?: StateMachine<any, any, any> | null
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
            target: 'offerComplete',
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
                return event.currentOffer
              },
              currentOfferId: (_, event) => {
                return event.currentOfferId
              },
            }),
          },
          NO_CURRENT_OFFER_FOUND: {
            target: 'offerComplete',
          },
        },
      },
      presentingCurrentOffer: {
        on: {
          RESPONDED_TO_OFFER: {
            target: 'offerComplete',
          },
          OFFER_DISMISSED: {
            target: 'offerComplete',
          },
          OFFER_CLOSED: {
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
            resolve(true)
          } else {
            reject()
          }
        }),
    },
  },
)
