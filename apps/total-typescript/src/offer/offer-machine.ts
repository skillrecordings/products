import {Subscriber} from '../lib/convertkit'
import {Offer} from './offer-types'
import {assign, createMachine} from 'xstate'

export type OfferMachineEvent =
  | {type: 'SUBSCRIBER_LOADED'; subscriber: Subscriber}
  | {type: 'NO_SUBSCRIBER_FOUND'}
  | {type: 'OFFER_DISMISSED'}
  | {type: 'OFFER_CLOSED'}
  | {type: 'NOT_ELIGIBLE_FOR_OFFERS'}
  | {type: 'OFFER_ELIGIBILITY_VERIFIED'}
  | {type: 'CURRENT_OFFER_READY'}
  | {type: 'NO_CURRENT_OFFER_FOUND'}
  | {type: 'RESPONDED_TO_OFFER'}
  | {type: 'POST_OFFER_CTA_AVAILABLE'}
  | {type: 'DISMISSAL_ACKNOWLEDGED'}
  | {type: 'OFFER_COMPLETE'}
  | {type: 'SUBSCRIBED'}

export type OfferContext = {
  subscriber?: Subscriber
  currentOffer?: Offer
}

export const offerMachine = createMachine<OfferContext, OfferMachineEvent>(
  {
    id: 'offerMachine',
    initial: 'loadingSubscriber',
    states: {
      loadingSubscriber: {
        entry: 'loadSubscriber',
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
            target: 'presentingSubscribeCta',
          },
        },
      },
      presentingSubscribeCta: {
        on: {
          SUBSCRIBED: {
            target: 'loadingSubscriber',
          },
          OFFER_DISMISSED: {
            target: 'acknowledgingDismissal',
          },
        },
      },
      verifyingOfferEligibility: {
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
          },
          NO_CURRENT_OFFER_FOUND: {
            target: 'offerComplete',
          },
        },
      },
      presentingCurrentOffer: {
        on: {
          RESPONDED_TO_OFFER: {
            target: 'processingOfferResponse',
          },
          OFFER_DISMISSED: {
            target: 'acknowledgingDismissal',
          },
        },
      },
      processingOfferResponse: {
        on: {
          POST_OFFER_CTA_AVAILABLE: {
            target: 'displayingPostOfferCta',
          },
          OFFER_COMPLETE: {
            target: 'loadingSubscriber',
          },
        },
      },
      displayingPostOfferCta: {
        on: {
          OFFER_COMPLETE: {
            target: 'loadingSubscriber',
          },
        },
      },
      acknowledgingDismissal: {
        on: {
          DISMISSAL_ACKNOWLEDGED: {
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
    actions: {
      loadSubscriber: async (context, event) => {},
    },
  },
)
