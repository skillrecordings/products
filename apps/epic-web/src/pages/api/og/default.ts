import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {getSdk} from '@skillrecordings/database'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getProduct, type Product} from 'lib/products'
import {getWorkshop} from 'lib/workshops'
import {NextApiRequest, NextApiResponse} from 'next'

const contextualShareCard = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const searchParams = new URLSearchParams(req.query as any)
    const hasResource = searchParams.has('resource')
    const resourceSlugOrId = searchParams.get('resource')
    let resource

    if (resourceSlugOrId) {
      resource = await getWorkshop(resourceSlugOrId)
    }

    const productId = resource ? resource.product.productId : undefined

    let products
    let defaultCoupon

    const {getDefaultCoupon} = getSdk()

    if (productId) {
      // if we have a productId, we only need to
      // fetch that product and its default coupon
      products = [await getProduct(productId)]
      const defaultCoupons = await getDefaultCoupon(
        products.map((product: Product) => {
          return product.upgradableTo?.[0].productId
        }),
      )
      defaultCoupon = defaultCoupons?.defaultCoupon
    } else {
      products = await getAllProducts()
      const defaultCoupons = await getDefaultCoupon(
        products.map((product: Product) => product.productId),
      )
      defaultCoupon = defaultCoupons?.defaultCoupon
    }

    // const defaultCoupon = {
    //   percentageDiscount: 0.25,
    //   expires: '2024-11-26T00:00:00.000Z',
    // }

    const url = defaultCoupon
      ? `${
          process.env.NEXT_PUBLIC_URL
        }/api/og/generate-default?percentageDiscount=${
          defaultCoupon.percentageDiscount
        }${resource ? `&image=${resource.ogImage}` : ''}${
          defaultCoupon?.product?.name
            ? `&productName=${defaultCoupon.product.name}`
            : ''
        }`
      : `${process.env.NEXT_PUBLIC_URL}/api/og/generate-default`

    const response = await fetch(url, {
      method: 'GET',
    })

    if (response.ok) {
      // Set the response content type to match the image type
      res.setHeader('Content-Type', 'image/png')

      // Convert the response body to a buffer and send it as the response
      const buffer = await response.arrayBuffer()
      res.send(Buffer.from(buffer))
    } else {
      // Handle errors from the edge runtime endpoint
      res.status(response.status).json({
        error: `Failed to generate the share card image: ${response.statusText}`,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({error: 'Internal Server Error'})
  }
}

export default contextualShareCard
