import {getToken} from 'next-auth/jwt'
import {getSdk} from '../lib/prisma-api'
import get from 'lodash/get'
import last from 'lodash/last'
import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

const defaultProductQuery = groq`*[_type == "product" && productId == $productId][0]{
  productId,
  modules[]->{
    "slug": slug.current,
    title,
    sections[]->{
      "slug": slug.current,
      title,
      lessons[]->{
        "slug": slug.current,
        title
      }
    }
  }
  }`

/**
 * gets the top tier product for user and all purchases
 * TODO: move to skill-api
 * @param req
 * @param productQuery
 */
export async function getPurchasedProduct(
  req: any,
  productQuery: string = defaultProductQuery,
) {
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (sessionToken && sessionToken.sub) {
    const {getPurchasesForUser} = getSdk()
    const purchases = await getPurchasesForUser(sessionToken.sub)

    if (purchases) {
      const productId = get(last(purchases), 'productId')

      // fetch product from sanity based on user's productId associated with their purchase
      return {
        product: await sanityClient.fetch(productQuery, {
          productId: productId,
        }),
        purchases,
      }
    }
  }
  return {product: {modules: []}}
}
