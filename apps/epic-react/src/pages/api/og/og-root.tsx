import {getSdk} from '@skillrecordings/database'
import {NextApiRequest, NextApiResponse} from 'next'
import {
  getActiveProducts,
  getAllProducts,
} from '@skillrecordings/skill-lesson/lib/products'
import type {NextRequest} from 'next/server'

const couponAwareShareCard = async (req: NextRequest, res: NextApiResponse) => {
  try {
    const {getDefaultCoupon} = getSdk()
    // const products = await getActiveProducts()
    const products = await getAllProducts()
    const defaultCoupons = await getDefaultCoupon(
      products?.map((product: any) => product.productId),
    )
    // const defaultCoupon = {
    //   percentageDiscount: 0.25,
    //   expires: '2024-10-26T00:00:00.000Z',
    // }
    const defaultCoupon = defaultCoupons?.defaultCoupon

    const url = defaultCoupon
      ? (
          defaultCoupon?.expires
            ? new Date(defaultCoupon.expires) > new Date()
            : true
        )
        ? `${process.env.NEXT_PUBLIC_URL}/api/og/og-sale?discount=${defaultCoupon.percentageDiscount}`
        : `${process.env.NEXT_PUBLIC_URL}/epic-react-v2-default-card@2x.jpg`
      : `${process.env.NEXT_PUBLIC_URL}/epic-react-v2-default-card@2x.jpg`

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

export default couponAwareShareCard
