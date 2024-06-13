import {format} from 'date-fns'
import {
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
  tagSubscriber,
} from '@skillrecordings/convertkit-sdk'
import {Purchase} from '@skillrecordings/database'
import {sanityClient} from '../../../lib/sanity-client'
import groq from 'groq'
import {postToSlack} from '../../../server'
import {WebClient} from '@slack/web-api'

/**
 * @deprecated we purchase products not modules, modules belong to products
 */
const moduleProductQuery = groq`*[_type == "module" && moduleType == 'workshop' && $productId in resources[].productId][0] {
  _id,
  "slug": resources[@._type == 'product'][0].slug,
  resources[]->,
  "productId": resources[@._type == 'product'][0].productId,
  "convertkitPurchasedTagId": resources[@._type == 'product'][0].convertkitPurchasedTagId,
}`

const productQuery = groq`*[_type == "product" && $productId == productId][0] {
  _id,
  slug,
  resources[]->,
  productId,
  convertkitPurchasedTagId,
}`

async function getSanityProduct(productId: string) {
  let sanityProduct = await sanityClient.fetch(productQuery, {
    productId,
  })

  if (!sanityProduct) {
    sanityProduct = await sanityClient.fetch(moduleProductQuery, {
      productId,
    })
  }
  return sanityProduct
}

export async function convertkitTagPurchase(email: string, purchase: Purchase) {
  // skip CK tagging in development
  if (process.env.SKIP_CK_TAGGING === 'true')
    return {tagged: false, reason: 'SKIP_CK_TAGGING is true'}

  try {
    const sanityProduct = await getSanityProduct(purchase.productId)

    const convertkitPurchasedTagId: string | undefined =
      sanityProduct?.convertkitPurchasedTagId ||
      process.env.CONVERTKIT_PURCHASED_TAG_ID

    if (!convertkitPurchasedTagId) {
      if (process.env.NODE_ENV === 'production') {
        await postToSlack({
          webClient: new WebClient(process.env.SLACK_TOKEN),
          channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
          text: `process.env.CONVERTKIT_PURCHASED_TAG_ID is not set for ${purchase.productId}`,
          attachments: [],
        })
      }

      // no tagging is going to happen (unless we want to lookup by email), so return early
      return {
        tagged: false,
        reason: 'convertkitPurchasedTagId is not set',
      }
    }

    let subscriber = await tagSubscriber(email, convertkitPurchasedTagId)

    if (subscriber) {
      const purchasedOnFieldName = sanityProduct
        ? `purchased_${sanityProduct.slug.current.replace(/-/gi, '_')}_on`
        : process.env.CONVERTKIT_PURCHASED_ON_FIELD_NAME || 'purchased_on'

      await setConvertkitSubscriberFields(subscriber, {
        [purchasedOnFieldName]: format(new Date(), 'yyyy-MM-dd HH:mm:ss z'),
      })

      return {
        tagged: true,
        details: {
          body: subscriber,
          cookies: getConvertkitSubscriberCookie(subscriber),
          headers: [{key: 'Cache-Control', value: 'max-age=10'}],
        },
      }
    } else {
      return {
        tagged: false,
        reason: 'subscriber not found',
      }
    }
  } catch (e) {
    console.log(e)

    return {tagged: false, reason: `error: ${e}`}
  }

  return true
}
