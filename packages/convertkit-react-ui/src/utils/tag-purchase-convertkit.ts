import {CONVERTKIT_BASE_URL} from '@skillrecordings/config'
import axios from 'axios'

export const convertkitAxios = axios.create({
  baseURL: CONVERTKIT_BASE_URL,
})

/**
 * @deprecated use convertkit-sdk instead
 * @param email
 */
export async function tagPurchaseConvertkit(email: string) {
  try {
    await convertkitAxios.post(
      `/tags/${process.env.CONVERTKIT_PURCHASED_TAG_ID}/subscribe`,
      {api_secret: process.env.CONVERTKIT_API_SECRET, email},
    )
  } catch (e) {
    console.log(e)
    return false
  }

  return true
}
