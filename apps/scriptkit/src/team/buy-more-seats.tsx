import React from 'react'
import {z} from 'zod'
import {useDebounce} from '@skillrecordings/react'
import {PriceDisplay} from 'path-to-purchase-react/pricing'
import {trpc} from 'trpc/trpc.client'
import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'

const buyMoreSeatsSchema = z.object({productId: z.string(), userId: z.string()})
type BuyMoreSeatsProps = z.infer<typeof buyMoreSeatsSchema>

const BuyMoreSeats = (props: BuyMoreSeatsProps) => {
  const {productId, userId} = buyMoreSeatsSchema.parse(props)

  const [quantity, setQuantity] = React.useState(5)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)

  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery({
    productId,
    quantity: debouncedQuantity,
  })

  const formActionPath = buildStripeCheckoutPath({
    userId,
    quantity: debouncedQuantity,
    productId: formattedPrice?.id,
    bulk: Boolean(formattedPrice?.bulk),
    couponId: formattedPrice?.appliedMerchantCoupon?.id,
  })

  return (
    <form className="pt-3" action={formActionPath} method="POST">
      <fieldset
        id="team-upgrade-pricing-inline"
        className="flex w-full items-center justify-between"
      >
        <label className="inline-flex items-center gap-3">
          <span className="opacity-80">Seats</span>
          <input
            defaultValue={quantity}
            required={true}
            type="number"
            min={1}
            max={100}
            step={1}
            onChange={(e) => {
              const newQuantity = Number(e.target.value)
              setQuantity(newQuantity)
            }}
            className="rounded-md border border-gray-800 bg-gray-900 py-2 pl-3 font-mono font-bold"
          />
        </label>
        <div data-pricing-product="">
          <div
            data-pricing-product-header=""
            className="flex items-center gap-5"
          >
            <PriceDisplay status={status} formattedPrice={formattedPrice} />
            <button
              className="rounded-md bg-cyan-400 px-5 py-2 font-medium text-black transition hover:bg-cyan-300"
              type="submit"
              disabled={false}
            >
              Buy
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default BuyMoreSeats
