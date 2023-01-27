import {format} from 'date-fns'
import {
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
  tagSubscriber,
} from '@skillrecordings/convertkit-sdk'
import {Purchase} from '@skillrecordings/database'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'

export async function convertkitTagPurchase(email: string, purchase: Purchase) {
  try {
    const sanityProduct = await sanityClient.fetch(productQuery, {
      productId: purchase.productId,
    })
    const convertkitPurchasedTagId =
      sanityProduct?.convertkitPurchasedTagId ||
      process.env.CONVERTKIT_PURCHASED_TAG_ID

    if (!convertkitPurchasedTagId) {
      throw new Error('‼️ set convertkit purchase tag id')
    }

    const subscriber = await tagSubscriber(email, convertkitPurchasedTagId)

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

const productQuery = groq`*[_type == "module" && moduleType == 'workshop' && $productId in resources[].productId][0] {
  _id,
  resources[]->,
  "productId": resources[@._type == 'product'][0].productId,
  "convertkitPurchasedTagId": resources[@._type == 'product'][0].convertkitPurchasedTagId,
}`
