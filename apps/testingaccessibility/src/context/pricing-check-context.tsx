import React from 'react'
import {FormattedPrice} from '../utils/format-prices-for-product'

type PricintContextType = {
  addPrice: (price: FormattedPrice, productId: string) => void
  isDowngrade: (price?: FormattedPrice) => boolean
}

const defaultPriceCheckContext: PricintContextType = {
  addPrice: () => {},
  isDowngrade: () => false,
}

/**
 * used to check if a given price is a downgrade for the customer
 */
export function usePriceCheck() {
  return React.useContext(PriceCheckContext)
}

export const PriceCheckContext = React.createContext(defaultPriceCheckContext)

export const PriceCheckProvider: React.FC<any> = ({
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
      if (!price || purchasedProductIds.length === 0) {
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

  return (
    <PriceCheckContext.Provider
      value={{
        addPrice,
        isDowngrade,
      }}
    >
      {children}
    </PriceCheckContext.Provider>
  )
}
