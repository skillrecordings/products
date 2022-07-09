import {getPPPDiscountPercent} from './parity-coupon'
import {getBulkDiscountPercent} from './bulk-coupon'
import {getCalculatedPriced} from './get-calculated-price'
import {getSdk} from '../lib/prisma-api'
import {Context, defaultContext} from '../lib/context'
import {SpanContext} from '@vercel/tracing-js'

// 10% premium for an upgrade
// TODO: Display Coupon Errors
// TODO: Display Applied Site Coupon w/ Expiration
// departure from the three tiers we've used in the past and the third tier
// is for teams

export class PriceFormattingError extends Error {
  options: FormatPricesForProductOptions

  constructor(message: string, options: FormatPricesForProductOptions) {
    super(message)
    this.name = 'PriceFormattingError'
    this.options = options
  }
}

type FormatPricesForProductOptions = {
  productId: string
  country?: string
  quantity?: number
  code?: string
  couponId?: string
  ctx?: Context
  upgradeFromPurchaseId?: string
}

export type FormattedPrice = {
  id: string
  quantity: number
  unitPrice: number
  calculatedPrice: number
  availableCoupons: any[]
  appliedCoupon?: any
  upgradeFromPurchaseId?: string
}

/**
 * Creates a verified price for a given product based on the unit price
 * of the product, coupons, and other factors.
 *
 * @param {FormatPricesForProductOptions} options the Prisma context
 */
export async function formatPricesForProduct(
  options: FormatPricesForProductOptions,
  childOf?: SpanContext,
): Promise<FormattedPrice> {
  const {ctx = defaultContext, ...noContextOptions} = options
  const {
    productId,
    country = 'US',
    quantity = 1,
    code,
    couponId,
    upgradeFromPurchaseId,
  } = noContextOptions

  const {getProduct, getMerchantCoupon, getCoupon, getPrice, getPurchase} =
    getSdk({ctx, spanContext: childOf})

  const upgradeFromPurchase = upgradeFromPurchaseId
    ? await getPurchase({
        where: {
          id: upgradeFromPurchaseId,
        },
        select: {
          bulkCoupon: {
            select: {
              id: true,
            },
          },
          totalAmount: true,
          productId: true,
        },
      })
    : false

  const product = await getProduct({
    where: {id: productId},
    include: {
      prices: true,
    },
  })

  if (!product) {
    throw new PriceFormattingError(`no-product-found`, noContextOptions)
  }

  const price = await getPrice({where: {productId}})

  if (!price) throw new PriceFormattingError(`no-price-found`, noContextOptions)

  const pppDiscountPercent = getPPPDiscountPercent(country)
  const bulkCouponPercent = getBulkDiscountPercent(quantity)

  // if there's a coupon implied because an id is passed in, load it to verify
  const appliedCoupon = couponId
    ? await getMerchantCoupon({where: {id: couponId}})
    : undefined

  const pppApplied =
    quantity === 1 && appliedCoupon?.type === 'ppp' && pppDiscountPercent > 0

  // pick the bigger discount during a sale
  const appliedCouponLessThanPPP = appliedCoupon
    ? appliedCoupon.percentageDiscount.toNumber() < pppDiscountPercent
    : true
  const appliedCouponLessThanBulk = appliedCoupon
    ? appliedCoupon.percentageDiscount.toNumber() < bulkCouponPercent
    : true

  const pppAvailable =
    quantity === 1 && pppDiscountPercent > 0 && appliedCouponLessThanPPP
  const bulkDiscountAvailable =
    bulkCouponPercent > 0 && appliedCouponLessThanBulk && !pppApplied

  let defaultPriceProduct: FormattedPrice = {
    ...product,
    quantity,
    unitPrice: price.unitAmount.toNumber(),
    calculatedPrice: getCalculatedPriced({
      unitPrice: price.unitAmount.toNumber(),
      ...(upgradeFromPurchase && {
        fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
      }),
      quantity,
    }),
    availableCoupons: [],
    ...(upgradeFromPurchase && {
      upgradeFromPurchaseId,
    }),
  }

  if (appliedCoupon?.type === 'special') {
    defaultPriceProduct = {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        }),
        quantity,
      }),
      appliedCoupon,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
      }),
    }
  }

  // no ppp or bulk if you're applying a code
  if (code) {
    const coupon = await getCoupon({where: {code}})

    if (!coupon) throw new PriceFormattingError(`no-coupon`, noContextOptions)

    if (coupon) {
      if (coupon.restrictedToProductId !== productId) {
        throw new PriceFormattingError(
          'coupon-not-valid-for-product',
          noContextOptions,
        )
      }

      const calculatedPrice = getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: coupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        }),
      })

      return {
        ...defaultPriceProduct,
        calculatedPrice,
        appliedCoupon: coupon,
        ...(upgradeFromPurchase && {
          upgradeFromPurchaseId,
        }),
      }
    }
  } else if (appliedCoupon && pppApplied) {
    const invalidCoupon =
      pppDiscountPercent !== appliedCoupon.percentageDiscount.toNumber()

    if (invalidCoupon || appliedCoupon.type !== 'ppp')
      throw new PriceFormattingError(
        'coupon-not-valid-for-ppp',
        noContextOptions,
      )

    const {id, ...merchantCouponWithoutIdentifier} = appliedCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        }),
      }),
      appliedCoupon: merchantCouponWithoutIdentifier,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
      }),
    }
  } else if (
    appliedCoupon &&
    appliedCoupon.type === 'special' &&
    pppAvailable
  ) {
    // PPP + site coupon
    const pppCoupons = await couponForType(
      'ppp',
      pppDiscountPercent,
      ctx,
      country,
    )

    const {id, ...merchantCouponWithoutIdentifier} = appliedCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        }),
      }),
      appliedCoupon: merchantCouponWithoutIdentifier,
      availableCoupons: pppCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
      }),
    }
  } else if (pppAvailable) {
    // no PPP for bulk
    const pppCoupons = await couponForType(
      'ppp',
      pppDiscountPercent,
      ctx,
      country,
    )

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        ...(upgradeFromPurchase && {
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        }),
      }),
      availableCoupons: pppCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
      }),
    }
  } else if (bulkDiscountAvailable) {
    const bulkCoupons = await couponForType('bulk', bulkCouponPercent, ctx)
    const bulkCoupon = bulkCoupons[0]

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: bulkCoupon.percentageDiscount.toNumber(),
        quantity,
      }),
      ...(bulkCoupon && {appliedCoupon: bulkCoupon}),
    }
  }

  return defaultPriceProduct
}

async function couponForType(
  type: string,
  percentageDiscount: number,
  ctx: Context,
  country?: string,
) {
  const {getMerchantCoupons} = getSdk({ctx})
  const merchantCoupons =
    (await getMerchantCoupons({
      where: {type, percentageDiscount},
    })) || []

  return merchantCoupons.map((coupon: any) => {
    // for pricing we don't need the identifier so strip it here
    const {identifier, ...rest} = coupon
    return {...rest, ...(country && {country})}
  })
}
