import axios from 'axios'
import {pickBy} from 'lodash'
import {SellableResource} from '@skillrecordings/types'

const CHECKOUT_SESSION_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL

export async function createCheckoutSession(
  sellables: SellableResource[],
  site: string = 'kcdbundle',
) {
  if (!CHECKOUT_SESSION_URL) throw Error('no checkout session URL')

  return axios
    .post(
      CHECKOUT_SESSION_URL,
      pickBy({
        sellables,
        code: appliedCoupon,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        site,
        success_url:
          process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_SUCCESS_URL,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_CANCEL_URL,
      }),
    )
    .then(({data}) => data)
}
