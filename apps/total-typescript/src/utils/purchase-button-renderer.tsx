import {NextRouter} from 'next/router'
import {QueryStatus} from '@tanstack/react-query'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

export const totalTypescriptPurchaseButtonRenderer = (
  formattedPrice: any,
  product: SanityProduct,
  status: QueryStatus,
  quantity: number,
  canPurchaseTier: boolean,
  router?: NextRouter,
  buttonCtaLabel: string = 'Buy Now',
) => {
  const isContactUs = quantity >= 30

  console.log('product', product)

  return (
    <button
      data-pricing-product-checkout-button={product.slug}
      type={isContactUs ? 'button' : 'submit'}
      disabled={status === 'loading' || status === 'error' || !canPurchaseTier}
      onClick={() => {
        if (isContactUs) {
          router?.push('/for-teams')
        }
      }}
    >
      <span>
        {!canPurchaseTier
          ? 'Not Available'
          : isContactUs
          ? 'Contact Us'
          : formattedPrice?.upgradeFromPurchaseId
          ? 'Upgrade Now'
          : product?.action || buttonCtaLabel}
      </span>
    </button>
  )
}
