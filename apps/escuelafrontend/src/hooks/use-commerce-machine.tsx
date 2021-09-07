import React from 'react'
import axios from 'axios'
import get from 'lodash/get'
import noop from 'lodash/noop'
import pickBy from 'lodash/pickBy'
import isEmpty from 'lodash/isEmpty'
import isPast from 'date-fns/isPast'
import {useMachine} from '@xstate/react'
import {createMachine, assign} from 'xstate'
import {SellableResource, Price} from '@types'
import queryString from 'query-string'
import {isBrowser} from 'utils/is-browser'
import {loadStripe} from '@stripe/stripe-js'
import {useViewer} from 'contexts/viewer-context'
// TODO: set purchase key
const PURCHASE_KEY = 'sr_purchase'

const storePurchase = (purchase: any) => {
  try {
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase))
  } catch (error) {
    console.log(error)
  }
}

// TODO: set convertkit tags for after purchase
export const signupAfterPurchase = (
  title: string,
  email: string,
  purchase: any,
) => {
  const api_key = process.env.NEXT_PUBLIC_CONVERTKIT_PUBLIC_KEY
  const form = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM
  const bulkTag = 1888676

  const tagHash = {
    purchased: 12345,
  }

  const tags = [tagHash.purchased]

  if (purchase.quantity > 1) {
    tags.push(bulkTag)
  }

  return axios({
    method: 'post',
    url: `https://api.convertkit.com/v3/forms/${form}/subscribe`,
    data: {
      email,
      api_key,
      tags,
    },
  }).then(() => storePurchase(purchase))
}

type CreateCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
  purchaseHeaders?: any
}

interface CommerceMachineContext {
  sellable: SellableResource
  purchaseHeaders: any
  upgradeFromSellable?: SellableResource
  bulk: boolean
  error?: string | null
  price?: Price
  appliedCoupon?: string | null
  accessToken?: string
  notification?: string
  email?: string
  stripeToken?: string
  quantity?: number
  purchase?: {sellable: SellableResource}
  stripeCheckoutData?: any
  stripe?: any
}

type CommerceEvent =
  | {type: 'APPLY_COUPON'; appliedCoupon: string}
  | {type: 'DISMISS_COUPON'; appliedCoupon: null}
  | {
      type: 'SET_QUANTITY'
      quantity: number
      bulk: boolean
    }
  | {type: 'START_PURCHASE'}
  | {type: 'CLAIM_COUPON'; email: string}
  | {type: 'START_STRIPE_CHECKOUT'}
  | {type: 'CANCEL_PURCHASE'}
  | {type: 'HANDLE_PURCHASE'; email: string; stripeToken: string}

const createCommerceMachine = ({
  sellable,
  purchaseHeaders,
  upgradeFromSellable,
}: CreateCommerceMachineProps) =>
  createMachine<CommerceMachineContext, CommerceEvent>(
    {
      id: 'commerceMachine',
      initial: 'checkingCoupon',
      context: {
        sellable,
        purchaseHeaders,
        upgradeFromSellable,
        bulk: false,
        quantity: 1,
      },
      states: {
        checkingCoupon: {
          always: [
            {target: 'fetchingPrice', actions: 'checkForCouponInHeader'},
          ],
        },
        fetchingPrice: {
          invoke: {
            id: 'fetchPrice',
            src: (context, event) => {
              const {quantity, appliedCoupon, sellable, upgradeFromSellable} =
                context
              const {id: sellable_id, type} = sellable
              if (process.env.NEXT_PUBLIC_AUTH_DOMAIN) {
                return axios
                  .post(
                    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/sellable_purchases/prices`,
                    pickBy({
                      sellables: [
                        {
                          site: process.env.NEXT_PUBLIC_SITE_NAME,
                          sellable_id,
                          upgrade_from_sellable_id: upgradeFromSellable?.slug,
                          upgrade_from_sellable: upgradeFromSellable?.type,
                          sellable: type.toLowerCase(),
                          quantity,
                        },
                      ],
                      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                      site: process.env.NEXT_PUBLIC_SITE_NAME,
                      code: appliedCoupon,
                    }),
                  )
                  .then(({data}) => data)
              } else {
                return Promise.reject(
                  'process.env.NEXT_PUBLIC_AUTH_DOMAIN is not configured',
                )
              }
            },
            onDone: {
              target: 'checkingPriceData',
              actions: [
                assign({
                  price: (context, event) => event.data[0],
                }),
                'adjustPriceForUpgrade',
              ],
            },
            onError: {
              target: 'failure',
              actions: assign({error: (context, event) => event.data}),
            },
          },
        },
        checkingPriceData: {
          always: [
            {
              target: 'failure',
              cond: 'couponErrorIsPresent',
              actions: ['setErrorFromCoupon'],
            },
            {target: 'loadStripe', actions: ['checkForDefaultCoupon']},
          ],
        },
        loadStripe: {
          invoke: {
            id: 'fetchStripe',
            src: () =>
              process.env.NEXT_PUBLIC_STRIPE_TOKEN
                ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_TOKEN)
                : noop,
            onDone: {
              target: 'priceLoaded',
              actions: assign({
                stripe: (context, event) => event.data,
              }),
            },
            onError: {
              target: 'failure',
              actions: assign({error: (context, event) => event.data}),
            },
          },
        },
        priceLoaded: {
          on: {
            APPLY_COUPON: {
              target: 'fetchingPrice',
              actions: [
                assign({
                  appliedCoupon: (context, event) => event.appliedCoupon,
                }),
              ],
            },
            DISMISS_COUPON: {
              target: 'fetchingPrice',
              actions: ['clearAppliedCoupon'],
            },
            SET_QUANTITY: {
              target: 'fetchingPrice',
              actions: [
                assign({
                  quantity: (context, event) => event.quantity,
                  bulk: (context, event) => event.bulk,
                }),
                'clearAppliedCoupon',
              ],
            },
            START_PURCHASE: {
              target: 'stripePurchase',
            },
            CLAIM_COUPON: {
              target: 'handlePurchase',
              actions: [
                assign({
                  email: (context, event) => event.email,
                }),
              ],
            },
            START_STRIPE_CHECKOUT: {target: 'loadingStripeCheckoutSession'},
          },
        },
        loadingStripeCheckoutSession: {
          invoke: {
            id: 'createStripeCheckoutSession',
            src: (context, event) => {
              const {
                quantity,
                appliedCoupon,
                sellable,
                upgradeFromSellable,
                bulk,
              } = context
              if (process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL) {
                return axios
                  .post(
                    process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL,
                    pickBy({
                      sellables: [
                        {
                          site: process.env.NEXT_PUBLIC_SITE_NAME,
                          sellable_id: sellable.slug,
                          sellable: sellable.type.toLowerCase(),
                          bulk,
                          quantity,
                          upgrade_from_sellable_id: upgradeFromSellable?.slug,
                          upgrade_from_sellable: upgradeFromSellable?.type,
                        },
                      ],
                      code: appliedCoupon,
                      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                      site: process.env.NEXT_PUBLIC_SITE_NAME,
                      success_url:
                        process.env
                          .NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_SUCCESS_URL,
                      cancel_url:
                        process.env
                          .NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_CANCEL_URL,
                    }),
                  )
                  .then(({data}) => data)
              } else {
                return Promise.reject(
                  'process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL is not configured.',
                )
              }
            },
            onDone: {
              target: 'success',
              actions: [
                assign({
                  stripeCheckoutData: (context, event) => event.data,
                }),
                'sendToCheckout',
              ],
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => {
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
            CANCEL_PURCHASE: {
              target: 'priceLoaded',
            },
            HANDLE_PURCHASE: {
              target: 'handlePurchase',
              actions: [
                assign({
                  email: (context, event) => event.email,
                  stripeToken: (context, event) => event.stripeToken,
                }),
              ],
            },
          },
        },
        // add upgrading state
        handlePurchase: {
          invoke: {
            id: 'handlePurchase',
            src: (context, event) => {
              const {
                quantity,
                appliedCoupon,
                sellable,
                stripeToken,
                email,
                purchaseHeaders,
                upgradeFromSellable,
                bulk,
              } = context

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
                    {headers: purchaseHeaders},
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
                  purchase: (context, event) => event.data,
                }),
                'sendToThanks',
              ],
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => {
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
            START_PURCHASE: {
              target: 'stripePurchase',
              actions: ['clearError'],
            },
          },
        },
      },
    },
    {
      guards: {
        couponErrorIsPresent: (context, event) => {
          return !!context?.price?.coupon_error
        },
      },
      actions: {
        clearError: assign({error: (context, event) => null}),
        clearAppliedCoupon: assign({
          appliedCoupon: (context, event) => null,
        }),
        adjustPriceForUpgrade: assign({
          price: (context, event) => {
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
          error: (context, event) =>
            context.price && context.price.price_message,
        }),
        sendToThanks: (context, event) => {
          const {email, purchase, upgradeFromSellable} = context
          if (purchase && email) {
            signupAfterPurchase(
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
        sendToCheckout: (context, event) => {
          const {stripeCheckoutData, stripe} = context
          stripe.redirectToCheckout({
            sessionId: stripeCheckoutData.id,
          })
        },
        checkForDefaultCoupon: assign({
          appliedCoupon: (context, event) => {
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
          appliedCoupon: (context, event) => {
            try {
              const searchQuery =
                isBrowser() && queryString.parse(window.location.search)
              return get(searchQuery, 'coupon')
            } catch (e) {
              console.error({e})
              return null
            }
          },
        }),
      },
    },
  )

type UseCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
}

export const useCommerceMachine = ({
  sellable,
  upgradeFromSellable,
}: UseCommerceMachineProps) => {
  const {authToken, viewer} = useViewer()
  const sellableSlug = get(sellable, 'slug')
  const userId = get(viewer, 'id')
  const commerceMachine = React.useMemo(() => {
    // const purchaseHeaders = isFunction(authToken)
    //   ? {Authorization: `Bearer ${authToken()}`}
    //   : {}
    return createCommerceMachine({
      sellable,
      upgradeFromSellable,
    })
  }, [sellableSlug, userId, sellable, upgradeFromSellable])

  return useMachine(commerceMachine)
}
