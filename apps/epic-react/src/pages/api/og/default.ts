import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {getSdk} from '@skillrecordings/database'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {NextApiRequest, NextApiResponse} from 'next'

const contextualShareCard = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const {getDefaultCoupon} = getSdk()
    const products = await getAllProducts()
    const defaultCoupons = await getDefaultCoupon(
      products.map((product: SanityProduct) => product.productId),
    )
    const currentProduct = products[0]
    const defaultCoupon = defaultCoupons?.defaultCoupon
    const url = defaultCoupon
      ? currentProduct.state === 'active'
        ? `${process.env.NEXT_PUBLIC_URL}/api/og/generate-default?percentageDiscount=${defaultCoupon.percentageDiscount}`
        : `${process.env.NEXT_PUBLIC_URL}/api/og/generate-default`
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
