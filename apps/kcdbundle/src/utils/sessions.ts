import axios from 'axios'
import {pickBy} from 'lodash'
import {SellableResource} from '@skillrecordings/types'

const CHECKOUT_SESSION_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL

export async function createCheckoutSession(
  sellables: SellableResource[],
  email?: string,
  stripe_customer_id?: string,
) {
  if (!CHECKOUT_SESSION_URL) throw Error('no checkout session URL')

  if (sellables.length === 1) {
    sellables[0].description =
      "Since you've already purchased part of the bundle you can complete your bundle with this discounted course!"
  }

  return axios
    .post(
      CHECKOUT_SESSION_URL,
      pickBy({
        sellables,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        site: process.env.NEXT_PUBLIC_SITE_NAME || '',
        success_url:
          process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_SUCCESS_URL,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_CANCEL_URL,
        email,
        stripe_customer_id,
      }),
    )
    .then(({data}) => data)
}
