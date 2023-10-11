import {format} from 'date-fns'
import {
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
  tagSubscriber,
} from '@skillrecordings/convertkit-sdk'
import {Purchase} from '@skillrecordings/database'
import {sanityClient} from '../../../lib/sanity-client'
import groq from 'groq'

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
  if (process.env.SKIP_CK_TAGGING === 'true') return

  try {
    const sanityProduct = await getSanityProduct(purchase.productId)

    const convertkitPurchasedTagId =
      sanityProduct?.convertkitPurchasedTagId ||
      process.env.CONVERTKIT_PURCHASED_TAG_ID

    let subscriber

    if (sanityProduct?.convertkitPurchasedTagId) {
      subscriber = await tagSubscriber(email, convertkitPurchasedTagId)
    }

    if (process.env.CONVERTKIT_PURCHASED_TAG_ID) {
      subscriber = await tagSubscriber(email, convertkitPurchasedTagId)
    }

    if (!convertkitPurchasedTagId) {
      throw new Error('‼️ set convertkit purchase tag id')
    }

    const purchasedOnFieldName = sanityProduct
      ? `purchased_${sanityProduct.slug.current.replace(/-/gi, '_')}_on`
      : process.env.CONVERTKIT_PURCHASED_ON_FIELD_NAME || 'purchased_on'

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
