import axios from 'axios'
import {pickBy} from 'lodash'
import {SellableResource} from '@skillrecordings/types'

const CHECKOUT_SESSION_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_URL

const EPIC_REACT_CLIENT_ID = `4118545974333dd5a03999d7b141ec809b9e83725630934e907e7205a9ac83cf`
const TESTING_JAVASCRIPT_CLIENT_ID = `870edf7cfb5f6a3088fa8580452f90e111df42f7b46de9c969832bb8205ac38d`

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
        // code: appliedCoupon,
        client_id: TESTING_JAVASCRIPT_CLIENT_ID,
        site,
        success_url:
          process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_SUCCESS_URL,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_SESSIONS_CANCEL_URL,
      }),
    )
    .then(({data}) => data)
}
