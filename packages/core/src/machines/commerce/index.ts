import axios from '../../utils/axios'
import get from 'lodash/get'
import pickBy from 'lodash/pickBy'
import isEmpty from 'lodash/isEmpty'
import isPast from 'date-fns/isPast'
import {createMachine, assign} from 'xstate'
// /pure loads stripe on the first call (is someone makes a purchase)
import {loadStripe} from '@stripe/stripe-js/pure'
import {
  CommerceEvent,
  CommerceMachineContext,
  checkoutSessionFetcher,
  priceFetcher,
  signUpAfterPurchase,
} from './utils'

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

const commerceMachine = createMachine<CommerceMachineContext, CommerceEvent>(
  {
    id: 'commerceMachine',
    // first we need to check if coupon is in the header so we can apply it to our price fetch
    initial: 'checkingCoupon',
    context: {
      sellable: null,
      upgradeFromSellable: null,
      bulk: false,
      quantity: 1,
      stripePriceId: undefined,
    },
    states: {
      // check the coupon directly into fetching price
      checkingCoupon: {
        always: [{target: 'fetchingPrice', actions: 'checkForCouponInHeader'}],
      },
      // this will fetch the price from eggheads api or stripe depending on the presence
      // of stripePriceId
      fetchingPrice: {
        invoke: {
          id: 'fetchPrice',
          src: 'priceFetcher',
          onDone: {
            target: 'checkingPriceData',
            actions: [
              assign({
                price: (_, event) => event.data[0],
              }),
              // if `upgradeFromSellable` is present, then we know we need to adjust the displayed price
              'adjustPriceForUpgrade',
            ],
          },
          onError: {
            target: 'failure',
            actions: assign({error: (_, event) => event.data}),
          },
        },
      },
      // coupons can error on the price check so we need to set context if this is the case
      checkingPriceData: {
        always: [
          // maybe we could clear the coupon, refetch prices, and display a coupon error
          {
            target: 'failure',
            cond: 'couponErrorIsPresent',
            actions: ['setErrorFromCoupon'],
          },
          // check for default coupon will apply the coupon if its present
          // this is used for site wide sales
          {target: 'priceLoaded', actions: ['checkForDefaultCoupon']},
        ],
      },
      priceLoaded: {
        on: {
          // we use this action to apply PPP coupons
          APPLY_COUPON: {
            target: 'checkingCoupon',
            actions: [
              assign({
                appliedCoupon: (_, event) => event.appliedCoupon,
              }),
            ],
          },
          DISMISS_COUPON: {
            target: 'checkingCoupon',
            actions: ['clearAppliedCoupon'],
          },
          SET_QUANTITY: {
            target: 'fetchingPrice',
            actions: [
              assign({
                quantity: (_, event) => event.quantity,
                bulk: (_, event) => event.bulk,
              }),
              'clearAppliedCoupon',
            ],
          },
          // this transition is used for the old stripe checkout
          // we send this when the modal is open
          START_PURCHASE: {
            target: 'stripePurchase',
          },
          // when theres no stripePriceId and the price of the sellable comes back as $0, we can claim the sellable on the client
          CLAIM_COUPON: {
            target: 'handlePurchase',
            actions: [
              assign({
                email: (_, event) => event.email,
              }),
            ],
          },
          // This transition will kick of the stripe checkout flow
          START_STRIPE_CHECKOUT: {target: 'loadingStripeCheckoutSession'},
        },
      },
      loadingStripeCheckoutSession: {
        invoke: {
          id: 'createStripeCheckoutSession',
          src: 'checkoutSessionFetcher',
          onDone: {
            target: 'success',
            actions: [
              assign({
                stripeCheckoutData: (_, event) => event.data,
              }),
              'sendToCheckout',
            ],
          },
          onError: {
            target: 'failure',
            actions: assign({
              error: (_, event) => {
                return (
                  event?.data?.response?.data?.error ||
                  `Purchase failed. Please contact ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL} for help`
                )
              },
            }),
          },
        },
      },
      stripePurchase: {
        on: {
          // this action is fired when the stripe modal is closed by the user
          CANCEL_PURCHASE: {
            target: 'priceLoaded',
          },
          // this will fire when the user confirms a purchase with their info
          HANDLE_PURCHASE: {
            target: 'handlePurchase',
            actions: [
              assign({
                email: (_, event) => event.email,
                stripeToken: (_, event) => event.stripeToken,
              }),
            ],
          },
        },
      },
      // this is the old way to purchase sellables
      // these states could likely be cut out entirely
      handlePurchase: {
        invoke: {
          id: 'handlePurchase',
          src: (context) => {
            const {
              quantity,
              appliedCoupon,
              sellable,
              stripeToken,
              email,
              upgradeFromSellable,
              bulk,
            } = context

            if (!sellable) {
              throw new Error('sellable is undefined')
            }
            const {id: sellable_id, type} = sellable
            if (process.env.NEXT_PUBLIC_AUTH_DOMAIN) {
              return axios
                .post(
                  `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/sellable_purchases`,
                  pickBy({
                    site: process.env.NEXT_PUBLIC_SITE_NAME,
                    sellable_id,
                    sellable: type.toLowerCase(),
                    quantity,
                    stripeToken,
                    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                    code: appliedCoupon,
                    email,
                    bulk,
                    upgrade_from_sellable_id: upgradeFromSellable?.slug,
                    upgrade_from_sellable: upgradeFromSellable?.type,
                  }),
                )
                .then(({data}) => data)
            } else {
              return Promise.reject(
                'process.env.NEXT_PUBLIC_AUTH_DOMAIN is not set up',
              )
            }
          },
          onDone: {
            target: 'success',
            actions: [
              assign({
                purchase: (_, event) => event.data,
              }),
              'sendToThanks',
            ],
          },
          onError: {
            target: 'failure',
            actions: assign({
              error: (_, event) => {
                return (
                  event?.data?.response?.data?.error ||
                  `Purchase failed. Please contact ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL} for help`
                )
              },
            }),
          },
        },
      },
      success: {},
      failure: {
        on: {
          // This can probably be delete
          START_PURCHASE: {
            target: 'stripePurchase',
            actions: ['clearError'],
          },
        },
      },
    },
  },
  {
    services: {
      priceFetcher,
      checkoutSessionFetcher,
    },
    guards: {
      couponErrorIsPresent: (context, _) => {
        return !!context?.price?.coupon_error
      },
    },
    actions: {
      clearError: assign({error: (_,__) => null}),
      clearAppliedCoupon: assign({
        appliedCoupon: (_,__) => null,
      }),
      adjustPriceForUpgrade: assign({
        price: (context, _) => {
          const {upgradeFromSellable, price, quantity} = context
          if (isEmpty(upgradeFromSellable)) {
            return price
          }
          if (quantity && quantity > 1) {
            return price
          }
          if (price && upgradeFromSellable) {
            return {
              ...price,
              price: price.price - upgradeFromSellable.price,
            }
          }
        },
      }),
      setErrorFromCoupon: assign({
        error: (context, _) => context.price && context.price.price_message,
      }),
      sendToThanks: (context, _) => {
        const {email, purchase, upgradeFromSellable} = context
        if (purchase && email) {
          signUpAfterPurchase(
            purchase.sellable.title,
            email,
            purchase.sellable,
          ).finally(() => {
            window.scroll(0, 0)
            window.location.href = `/thanks?email=${encodeURIComponent(
              email,
            )}&upgrade=${!isEmpty(upgradeFromSellable)}`
          })
        }
      },
      sendToCheckout: async (context, _) => {
        const stripe = await loadStripe(stripePublicKey)
        if (stripe) {
          const {stripeCheckoutData} = context

          stripe.redirectToCheckout({
            sessionId: stripeCheckoutData.id,
          })
        }
      },
      checkForDefaultCoupon: assign({
        appliedCoupon: (context, _) => {
          const quantity = get(context, 'quantity')
          if (quantity !== 1) {
            return null
          }

          const existingAppliedCoupon = get(context, 'appliedCoupon')
          if (!isEmpty(existingAppliedCoupon)) {
            return existingAppliedCoupon
          }

          const defaultCoupon = get(context, 'price.coupon')
          const getDateFromUtc = (utc: number) => {
            let d = new Date(0)
            d.setUTCSeconds(utc)
            return d
          }

          if (
            !isEmpty(defaultCoupon) &&
            !isPast(getDateFromUtc(get(defaultCoupon, 'coupon_expires_at')))
          ) {
            return get(defaultCoupon, 'coupon_code')
          } else {
            return null
          }
        },
      }),
      checkForCouponInHeader: assign({
        appliedCoupon: (_,__) => {
          if (typeof window === 'undefined') {
            return null
          }
          try {
            const searchQuery = new URLSearchParams(window.location.search)
            return searchQuery.get('coupon')
          } catch (e) {
            console.error({e})
            return null
          }
        },
      }),
    },
  },
)

export default commerceMachine
