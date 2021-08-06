import axios from '../../utils/axios'
import pickBy from 'lodash/pickBy'
import isEmpty from 'lodash/isEmpty'
import {SellableResource, Price} from '../../@types'

export interface CommerceMachineContext {
  sellable: SellableResource | null
  upgradeFromSellable?: SellableResource | null
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
  stripePriceId?: string
}

export type CommerceEvent =
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

// This generates the params based on the presence of `stripePriceId`
// If its there, then we just need to send the id and quantity
// if not, then we send the sellable params
export const getStripeCheckoutParams = (
  machineContext: CommerceMachineContext,
) => {
  const {
    quantity,
    appliedCoupon,
    sellable,
    upgradeFromSellable,
    bulk,
    stripePriceId,
  } = machineContext

  if (!sellable) {
    throw new Error('sellable is undefined')
  }

  const result = isEmpty(stripePriceId)
    ? {
        sellables: [
          pickBy({
            site: sellable.site,
            sellable_id: sellable.slug,
            sellable: sellable.type.toLowerCase(),
            bulk,
            quantity,
            upgrade_from_sellable_id: upgradeFromSellable?.slug,
            upgrade_from_sellable: upgradeFromSellable?.type,
          }),
        ],
        code: appliedCoupon,
      }
    : {
        stripe_price_id: stripePriceId,
        quantity,
      }

  return pickBy(result)
}

// these are loaded from an env file so we know they are there
// this is the url we use to generate the checkout session
export const stripeCheckoutSessionUrl = process.env
  .NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL!
// The URL Stripe redirects to after a successful purchase
const stripeCheckoutSessionSuccessUrl = process.env
  .NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_SUCCESS_URL!
// The URL Stripe redirects to after a cancelled purchase
const stripeCheckoutSessionCancelUrl = process.env
  .NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_CANCEL_URL!
// This is the `site` column on the `Sellable`
const siteName = process.env.NEXT_PUBLIC_SITE_NAME!
// This is the `Doorkeeper::Application#uid` we use to identify the site with
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!

// This promise creates a Stripe checkout session
export const checkoutSessionFetcher = (
  machineContext: CommerceMachineContext,
) => {
  const params = {
    ...getStripeCheckoutParams(machineContext),
    site: siteName,
    client_id: clientId,
    success_url: stripeCheckoutSessionSuccessUrl,
    cancel_url: stripeCheckoutSessionCancelUrl,
  }

  return axios.post(stripeCheckoutSessionUrl, params).then(({data}:{data:any}) => data)
}

// This creates the params to fetch the price from a Sellable or a Stripe Price
// The sellable price is fetched from egghead's api
// The Stripe Price is fetched from stripe
export const getPriceParams = (machineContext: CommerceMachineContext) => {
  const {
    quantity,
    appliedCoupon,
    sellable,
    upgradeFromSellable,
    stripePriceId,
  } = machineContext

  if (!sellable) {
    throw new Error('sellable is undefined')
  }
  const {site, id: sellable_id, type} = sellable

  return isEmpty(stripePriceId)
    ? pickBy({
        sellables: [
          pickBy({
            sellable_id,
            upgrade_from_sellable_id: upgradeFromSellable?.slug,
            upgrade_from_sellable: upgradeFromSellable?.type,
            sellable: type.toLowerCase(),
            quantity,
          }),
        ],
        site: process.env.NEXT_PUBLIC_SITE_NAME || 'TEST_PRODUCT',
        code: appliedCoupon,
      })
    : {id: stripePriceId}
}

export const eggheadPriceCheckUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/sellable_purchases/prices`
export const stripePriceCheckUrl = `/api/stripe/prices`

export const priceFetcher = (machineContext: CommerceMachineContext) => {
  const {stripePriceId} = machineContext
  const params = getPriceParams(machineContext)

  return isEmpty(stripePriceId)
    ? axios.post(eggheadPriceCheckUrl, params).then(({data}:{data:any}) => data)
    : axios.get(stripePriceCheckUrl, {params}).then(({data}:{data:any}) => data)
}

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
export const signUpAfterPurchase = (
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
