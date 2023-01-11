import React from 'react'
import type {FormattedPrice} from '@skillrecordings/commerce-server/dist/@types'

type PricingContextType = {
  addPrice: (price: FormattedPrice, productId: string) => void
  isDowngrade: (price?: FormattedPrice) => boolean
  isDiscount: (price?: FormattedPrice) => boolean
}

const defaultPriceCheckContext: PricingContextType = {
  addPrice: () => {},
  isDowngrade: () => false,
  isDiscount: () => false,
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

      for (const productId of purchasedProductIds) {
        for (const key in prices) {
          if (key === productId) {
            if (prices[key].unitPrice > price.unitPrice) {
              return true
            }
          }
        }
      }
      return false
    },
    [prices],
  )

  const isDiscount = React.useCallback((price?: FormattedPrice) => {
    if (!price) {
      return false
    }
    return price.unitPrice > price.calculatedPrice
  }, [])

  return (
    <PriceCheckContext.Provider
      value={{
        addPrice,
        isDowngrade,
        isDiscount,
      }}
    >
      {children}
    </PriceCheckContext.Provider>
  )
}
