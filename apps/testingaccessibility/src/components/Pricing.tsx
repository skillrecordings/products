import * as React from 'react'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {useQuery} from 'react-query'
import {useDebounce} from '@skillrecordings/react'
import {FormattedPrice} from '../utils/format-prices-for-product'
import {Purchase} from '@prisma/client'
import {useSession} from 'next-auth/react'

const tier = {
  href: '#',
  description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  features: ['Community Forum', 'Access to everything'],
}

export const Pricing: React.FC<{
  product: {name: string; id: string}
  purchased?: boolean
  purchases?: Purchase[]
}> = ({product, purchased = false, purchases = []}) => {
  const [coupon, setCoupon] = React.useState()
  const [quantity, setQuantity] = React.useState(1)
  const {data: session} = useSession()
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)

  const {data: formattedPrice, status} = useQuery<FormattedPrice>(
    ['pricing', coupon, debouncedQuantity, product.id, session?.id],
    () =>
      fetch('/api/prices', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          coupon,
          quantity,
          purchases,
          ...(session && {userId: session?.id}),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()),
  )

  const availableCoupon = formattedPrice?.availableCoupons?.[0]
  const appliedCoupon = formattedPrice?.appliedCoupon

  return (
    <section>
      <div className="mt-8 pb-12 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
        <div className="relative">
          <div className="absolute inset-0 h-3/4" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-4 lg:gap-5 lg:space-y-0">
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div>
                    <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                    $
                    {status === 'loading'
                      ? ` --`
                      : `${formattedPrice?.calculatedPrice}`}
                  </div>
                  {appliedCoupon ? (
                    <div>
                      <div className="mt-4 flex items-baseline text-2xl font-extrabold">
                        {`${Math.floor(
                          appliedCoupon.percentageDiscount * 100,
                        )}% off of $${
                          (formattedPrice?.unitPrice || 0) *
                          (formattedPrice?.quantity || 0)
                        }`}
                      </div>
                      {appliedCoupon.type === 'site' ? (
                        <div>There is a sale!</div>
                      ) : null}
                      {appliedCoupon.type === 'ppp' ? (
                        <div>For regional discount.</div>
                      ) : null}
                      {appliedCoupon.type === 'bulk' ? (
                        <div>Team discount.</div>
                      ) : null}
                    </div>
                  ) : null}
                  {availableCoupon ? (
                    <div
                      onClick={() => {
                        setCoupon(availableCoupon.id)
                      }}
                    >
                      {availableCoupon.type}
                    </div>
                  ) : null}
                  <input
                    type="number"
                    min={1}
                    max={102}
                    step={1}
                    onChange={(e) => {
                      setCoupon(undefined)
                      setQuantity(Number(e.target.value))
                    }}
                    value={quantity}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                  <ul role="list" className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon
                            className="h-6 w-6 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {purchased ? (
                    <section>
                      <button
                        className="disabled w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        type="submit"
                        role="link"
                        disabled
                      >
                        Purchased
                      </button>
                    </section>
                  ) : (
                    <form
                      action={`/api/stripe/checkout?productId=${
                        formattedPrice?.id
                      }&couponId=${appliedCoupon?.id}&quantity=${quantity}${
                        session?.user ? `&userId=${session.id}` : ``
                      }${
                        formattedPrice?.upgradeFromPurchaseId
                          ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
                          : ``
                      }`}
                      method="POST"
                    >
                      <section>
                        <button
                          className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          type="submit"
                          role="link"
                        >
                          {formattedPrice?.upgradeFromPurchaseId
                            ? `Upgrade Now`
                            : `Buy Now`}
                        </button>
                      </section>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
