import React from 'react'
import {z} from 'zod'
import type {FormattedPrice} from '@skillrecordings/commerce-server/dist/@types'
import {useQuery} from 'react-query'
import {useDebounce} from '@skillrecordings/react'

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

  const {data: formattedPrice, status} = useQuery<FormattedPrice>(
    ['pricing', debouncedQuantity, productId],
    () =>
      fetch('/api/skill/prices', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          quantity: debouncedQuantity,
          purchases: [],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((formattedPrice: FormattedPrice) => {
          return formattedPrice
        }),
  )

  const {calculatedPrice} = z
    .object({calculatedPrice: z.number(), id: z.string()})
    .or(z.undefined())
    .transform((value) => {
      return !!value ? value : {calculatedPrice: 0}
    })
    .parse(formattedPrice)

  const formActionPath = buildFormActionPath({
    userId,
    quantity: debouncedQuantity,
    productId,
  })

  return (
    <form className="pt-3" action={formActionPath} method="POST">
      <fieldset className="flex justify-between w-full items-center">
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
            className="bg-gray-100 border border-gray-200 pl-3 py-2 rounded-md font-bold font-mono"
          />
        </label>
        <div className="flex items-center gap-5">
          <div aria-live="polite" className="text-lg font-medium">
            {'$' + calculatedPrice}
          </div>
          <button
            className="px-5 py-2 bg-green-500 rounded-md font-bold text-white"
            type="submit"
            disabled={false}
          >
            Buy
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default BuyMoreSeats
