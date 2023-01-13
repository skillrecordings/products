import React from 'react'
import {z} from 'zod'
import {useDebounce} from '@skillrecordings/react'
import {PriceDisplay} from 'path-to-purchase-react/pricing'
import {trpc} from 'utils/trpc'

const buildFormActionPath = (params: {
  userId: string
  quantity: number
  productId: string
}) => {
  const {productId, quantity, userId} = params

  const queryParamString = new URLSearchParams({
    productId,
    quantity: String(quantity),
    userId,
  }).toString()

  return `/api/skill/checkout/stripe?${queryParamString}`
}

const buyMoreSeatsSchema = z.object({productId: z.string(), userId: z.string()})
type BuyMoreSeatsProps = z.infer<typeof buyMoreSeatsSchema>

const BuyMoreSeats = (props: BuyMoreSeatsProps) => {
  const {productId, userId} = buyMoreSeatsSchema.parse(props)

  const [quantity, setQuantity] = React.useState(5)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)

  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery({
    productId,
    userId,
    quantity: debouncedQuantity,
  })

  const formActionPath = buildFormActionPath({
    userId,
    quantity: debouncedQuantity,
    productId,
  })

  return (
    <form className="" action={formActionPath} method="POST">
      <fieldset
        id="team-upgrade-pricing-inline"
        className="flex w-full flex-col justify-between gap-5"
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
            className="rounded-md border border-gray-200 bg-gray-100 py-2 pl-3 font-mono font-bold"
          />
        </label>

        <div data-pricing-product-header="" className="flex items-center gap-5">
          <PriceDisplay status={status} formattedPrice={formattedPrice} />
        </div>
        <button
          className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600"
          type="submit"
          disabled={false}
        >
          Buy more seats
        </button>
      </fieldset>
    </form>
  )
}

export default BuyMoreSeats
