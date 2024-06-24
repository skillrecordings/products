import * as React from 'react'
import {Dispatch, SetStateAction} from 'react'
import type {FormattedPrice} from '@skillrecordings/commerce-server/dist/@types'
import type {MerchantCoupon} from '@skillrecordings/database'

type MinimalMerchantCoupon = Omit<
  MerchantCoupon & {
    country?: string
  },
  'identifier'
>

type PricingContextType = {
  addPrice: (price: FormattedPrice, productId: string) => void
  isDowngrade: (price?: FormattedPrice) => boolean
  isDiscount: (price?: FormattedPrice) => boolean
  merchantCoupon?: MinimalMerchantCoupon | undefined
  setMerchantCoupon: Dispatch<SetStateAction<MinimalMerchantCoupon | undefined>>
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
}

const defaultPriceCheckContext: PricingContextType = {
  addPrice: () => {},
  isDowngrade: () => false,
  isDiscount: () => false,
  merchantCoupon: undefined,
  setMerchantCoupon: () => {},
  quantity: 1,
  setQuantity: () => {},
}

/**
 * used to check if a given price is a downgrade for the customer
 */
export function usePriceCheck() {
  return React.useContext(PriceCheckContext)
}

export const PriceCheckContext = React.createContext(defaultPriceCheckContext)

export const PriceCheckProvider: React.FC<React.PropsWithChildren<any>> = ({
  children,
  purchasedProductIds,
}) => {
  const [prices, setPrices] = React.useState<any>({})

  const addPrice = React.useCallback(
    (price: FormattedPrice, productId: string) => {
      setPrices((prevPrices: any) => ({
        ...prevPrices,
        [productId]: price,
      }))
    },
    [prices],
  )

  const isDowngrade = React.useCallback(
    (price?: FormattedPrice) => {
      if (!price || !purchasedProductIds || purchasedProductIds.length === 0) {
        return false
      }

      const unitPriceOfPurchasedProducts = []
      for (const productId of purchasedProductIds) {
        const purchasedPrice = prices[productId]
        if (purchasedPrice) {
          unitPriceOfPurchasedProducts.push(purchasedPrice.unitPrice)
        }
      }

      // if any purchased product has a unit price greater than the price
      // we are checking, then it is a downgrade
      return unitPriceOfPurchasedProducts.some(
        (unitPrice) => unitPrice > price.unitPrice,
      )
    },
    [prices],
  )

  const isDiscount = React.useCallback((price?: FormattedPrice) => {
    if (!price) {
      return false
    }
    return price.fullPrice > price.calculatedPrice
  }, [])

  const [merchantCoupon, setMerchantCoupon] = React.useState<
    MinimalMerchantCoupon | undefined
  >()

  const [quantity, setQuantity] = React.useState(1)

  return (
    <PriceCheckContext.Provider
      value={{
        addPrice,
        isDowngrade,
        isDiscount,
        merchantCoupon,
        setMerchantCoupon,
        quantity,
        setQuantity,
      }}
    >
      {children}
    </PriceCheckContext.Provider>
  )
}
