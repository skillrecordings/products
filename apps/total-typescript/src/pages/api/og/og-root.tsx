import {getSdk} from '@skillrecordings/database'
import {NextApiRequest, NextApiResponse} from 'next'
import {getPricing} from '../../../lib/pricing'

const couponAwareShareCard = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const {getDefaultCoupon} = getSdk()
    const pricing = await getPricing('primary')
    const products = pricing?.products
    const defaultCoupons = await getDefaultCoupon(
      products?.map((product: any) => product.productId),
    )
    // const defaultCoupon: DefaultCoupon = {
    //   percentageDiscount: 0.25,
    //     expires: '2024-06-26T00:00:00.000Z',
    // }
    const defaultCoupon = defaultCoupons?.defaultCoupon
    const url = defaultCoupon
      ? (
          defaultCoupon?.expires
            ? new Date(defaultCoupon.expires) > new Date()
            : true
        )
        ? `${process.env.NEXT_PUBLIC_URL}/api/og/og-sale?discount=${defaultCoupon.percentageDiscount}`
        : `${process.env.NEXT_PUBLIC_URL}/card@2x.png?date=25/06/24`
      : `${process.env.NEXT_PUBLIC_URL}/card@2x.png?date=25/06/24`

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
