import React from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import {useViewer} from 'contexts/viewer-context'
import PurchaseBundle from './purchase-bundle'
import Image from 'next/image'
import {getBundleDescription} from 'utils/get-bundle-metadata'

function UpgradePurchase() {
  const {upgradeFromSellable, upgradeToSellable} = useViewer()

  const pppCountry = get(
    upgradeFromSellable,
    'coupon.restricted_to_country_name',
    get(upgradeFromSellable, 'coupon.restricted_to_country_code'),
  )

  const isPPP =
    get(upgradeFromSellable, 'slug') === process.env.NEXT_PUBLIC_PRO_SLUG &&
    !isEmpty(pppCountry)

  return !isEmpty(upgradeToSellable) && !isEmpty(upgradeFromSellable) ? (
    <div
      className="my-16 py-16 bg-gray-100 dark:bg-gray-900 -mx-5 px-5"
      id="upgrade"
    >
      <h2 className="text-center sm:text-4xl text-3xl font-bold mb-2 pb-10 max-w-screen-md mx-auto leading-tight">
        Upgrade to{' '}
        {isPPP ? 'remove your location restrictions' : 'access all the content'}
      </h2>
      <div className="max-w-sm mx-auto">
        {isPPP && (
          <p className="text-center text-md md:w-1/2 w-3/4 m-auto">
            You will only pay the difference of your first purchase ($
            {upgradeFromSellable.price}) with the full price of{' '}
            {upgradeToSellable.title} (${upgradeToSellable.price})
          </p>
        )}
        <div className="relative px-5 pb-5 dark:bg-gray-1000 bg-white rounded-lg sm:mb-0 mb-5 shadow-xl">
          <PurchaseBundle
            stripeCheckoutV1Enabled
            bundle={upgradeToSellable}
            upgradeFromSellable={upgradeFromSellable}
          />
          <ul className="pb-2 font-semibold">
            {getBundleDescription(upgradeToSellable.slug)?.map((item: any) => (
              <li
                key={item}
                className="py-1 text-gray-900 dark:text-gray-100 flex items-center"
              >
                <span className="w-6 h-6 font-bold text-sm text-center leading-tight rounded-full bg-blue-100 ml-1 mr-3 flex items-center justify-center text-blue-500">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul>
            {upgradeToSellable.items.map((item: any) => (
              <li key={item} className="flex items-center py-1">
                <div className="flex-shrink-0 flex">
                  <Image
                    src={item.square_cover_128_url}
                    width={32}
                    height={32}
                    alt={item.title}
                  />
                </div>
                <span className="ml-2">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null
}

export default UpgradePurchase
