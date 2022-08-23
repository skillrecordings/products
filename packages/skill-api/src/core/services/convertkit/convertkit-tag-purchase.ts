import {format} from 'date-fns'
import {
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
  tagSubscriber,
} from '@skillrecordings/convertkit-sdk'

export async function convertkitTagPurchase(email: string) {
  try {
    if (!process.env.CONVERTKIT_PURCHASED_TAG_ID) {
      throw new Error('‼️ set convertkit purchase tag id')
    }
    const subscriber = await tagSubscriber(
      email,
      process.env.CONVERTKIT_PURCHASED_TAG_ID,
    )

    const purchasedOnFieldName =
      process.env.CONVERTKIT_PURCHASED_ON_FIELD_NAME || 'purchased_on'

    await setConvertkitSubscriberFields(subscriber, {
      [purchasedOnFieldName]: format(new Date(), 'yyyy-mm-dd HH:MM'),
    })

    if (subscriber) {
      return {
        status: 200,
        body: subscriber,
        cookies: getConvertkitSubscriberCookie(subscriber),
        headers: [{key: 'Cache-Control', value: 'max-age=10'}],
      }
    } else {
      return {
        status: 200,
      }
    }
  } catch (e) {
    console.log(e)
    return false
  }

  return true
}
