import React from 'react'
import {z} from 'zod'
import {useDebounce} from '@skillrecordings/react'
import {PriceDisplay} from '../path-to-purchase/pricing'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'

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

const buyMoreSeatsSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  buttonLabel: z.string().default('Buy').nullish(),
})
type BuyMoreSeatsProps = z.infer<typeof buyMoreSeatsSchema>

const BuyMoreSeats = ({
  productId,
  userId,
  buttonLabel = 'Buy',
}: BuyMoreSeatsProps) => {
  const [quantity, setQuantity] = React.useState(5)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)

  const {data: formattedPrice, status} =
    trpcSkillLessons.pricing.formatted.useQuery({
      productId,
      quantity: debouncedQuantity,
    })

  const formActionPath = buildFormActionPath({
    userId,
    quantity: debouncedQuantity,
    productId,
  })

  return (
    <form data-buy-more-seats-form="" action={formActionPath} method="POST">
      <fieldset id="team-upgrade-pricing-inline">
        <div data-seats-form="">
          <label>Seats</label>
          <button
            type="button"
            aria-label="decrease seat quantity by one"
            onClick={() => {
              if (quantity === 1) return
              setQuantity(quantity - 1)
            }}
          >
            -
          </button>
          <input
            value={quantity}
            required={true}
            type="number"
            min={1}
            max={100}
            step={1}
            onChange={(e) => {
              const newQuantity = Number(e.target.value)
              setQuantity(newQuantity)
            }}
          />
          <button
            type="button"
            aria-label="increase seat quantity by one"
            onClick={() => {
              if (quantity === 100) return
              setQuantity(quantity + 1)
            }}
          >
            +
          </button>
        </div>
        <div data-pricing-product="">
          <div data-pricing-product-header="">
            <PriceDisplay status={status} formattedPrice={formattedPrice} />
            <button type="submit" disabled={false}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default BuyMoreSeats
