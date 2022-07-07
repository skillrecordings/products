import {convertkitAxios} from '@skillrecordings/axios'

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
