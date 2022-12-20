import {Purchase} from '@skillrecordings/database'
import type {FormattedPrice} from '@skillrecordings/commerce-server/dist/@types'
import {useQuery} from 'react-query'
import {z} from 'zod'

const merchantCouponSchema = z.object({
  id: z.string(),
  type: z.string(),
})

const FormattedPriceOptionsSchema = z.object({
  productId: z.string(),
  userId: z.string().optional(),
  quantity: z.number(),
  couponId: z.string().optional(),
  merchantCoupon: merchantCouponSchema.optional(),
})
type FormattedPriceOptions = z.infer<typeof FormattedPriceOptionsSchema>

export const useFormattedPrice = (
  _options: FormattedPriceOptions & {purchases: Purchase[]},
) => {
  const {purchases, ...options} = _options

  const params = FormattedPriceOptionsSchema.transform((parsedOptions) => {
    const {productId, userId, quantity, couponId, merchantCoupon} =
      parsedOptions

    return {
      productId,
      userId,
      quantity,
      purchases,
      siteCouponId: couponId,
      ...(merchantCoupon && {merchantCouponId: merchantCoupon.id}),
    }
  }).parse(options)

  const formattedPriceFetcher = (): Promise<FormattedPrice> => {
    return fetch('/api/skill/prices', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
  }

  const {data: formattedPrice, status} = useQuery(
    ['pricing', options],
    formattedPriceFetcher,
  )

  return {formattedPrice, status}
}
