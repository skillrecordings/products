import {getPPPDiscountPercent} from './parity-coupon'
import {getCalculatedPriced} from './get-calculated-price'
import {Context, defaultContext, getSdk} from '@skillrecordings/database'
import type {Purchase, Product} from '@skillrecordings/database'
import {FormattedPrice} from './@types'
import isEmpty from 'lodash/isEmpty'
import {determineCouponToApply} from './determine-coupon-to-apply'

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
  merchantCouponId?: string
  ctx?: Context
  upgradeFromPurchaseId?: string
  userId?: string
}

export async function getFixedDiscountForUpgrade({
  purchaseToBeUpgraded,
  productToBePurchased,
  ctx = defaultContext,
}: {
  purchaseToBeUpgraded: Purchase | null
  productToBePurchased: Product
  ctx?: Context
}) {
  // if there is no purchase to be upgraded, then this isn't an upgrade
  // and the Fixed Discount should be 0.
  if (
    purchaseToBeUpgraded === null ||
    purchaseToBeUpgraded?.productId === undefined
  ) {
    return 0
  }

  // if the Purchase To Be Upgraded is `restricted` and it has a matching
  // `productId` with the Product To Be Purchased, then this is a PPP
  // upgrade, so use the purchase amount.
  if (
    purchaseToBeUpgraded.status === 'Restricted' &&
    purchaseToBeUpgraded.productId === productToBePurchased.id
  ) {
    return purchaseToBeUpgraded.totalAmount.toNumber()
  }

  // if Purchase To Be Upgraded is upgradeable to the Product To Be Purchased,
  // then look up the Price of the original product
  const {getPrice, availableUpgradesForProduct} = getSdk({ctx})
  const upgradeIsAvailable = !isEmpty(
    await availableUpgradesForProduct(
      [purchaseToBeUpgraded],
      productToBePurchased.id,
    ),
  )
  if (upgradeIsAvailable) {
    const price = await getPrice({
      where: {
        productId: purchaseToBeUpgraded.productId,
      },
    })

    return price?.unitAmount.toNumber() || 0
  }

  return 0
}

/**
 * Creates a verified price for a given product based on the unit price
 * of the product, coupons, and other factors.
 *
 * 30 minute loom walkthrough of this function:
 * https://www.loom.com/share/8cbd2213d44145dea51590b380f5d0d7?sid=bec3caeb-b742-4425-ae6e-81ca98c88f91
 *
 * @param {FormatPricesForProductOptions} options the Prisma context
 */
export async function formatPricesForProduct(
  options: FormatPricesForProductOptions,
): Promise<FormattedPrice> {
  const {ctx = defaultContext, ...noContextOptions} = options
  const {
    productId,
    country = 'US',
    quantity = 1,
    code,
    merchantCouponId,
    upgradeFromPurchaseId,
    userId,
  } = noContextOptions

  const {
    getProduct,
    getMerchantCoupon,
    couponForIdOrCode,
    getPrice,
    getPurchase,
  } = getSdk({ctx})

  const upgradeFromPurchase = upgradeFromPurchaseId
    ? await getPurchase({
        where: {
          id: upgradeFromPurchaseId,
        },
        select: {
          id: true,
          bulkCoupon: {
            select: {
              id: true,
            },
          },
          redeemedBulkCouponId: true,
          totalAmount: true,
          productId: true,
          status: true,
        },
      })
    : null

  const upgradedProduct = upgradeFromPurchase
    ? await getProduct({
        where: {
          id: upgradeFromPurchase.productId,
        },
        select: {
          id: true,
          prices: true,
        },
      })
    : null

  const product = await getProduct({
    where: {id: productId},
    include: {
      prices: true,
    },
  })

  if (!product) {
    throw new PriceFormattingError(`no-product-found`, noContextOptions)
  }

  const fixedDiscountForUpgrade = await getFixedDiscountForUpgrade({
    purchaseToBeUpgraded: upgradeFromPurchase,
    productToBePurchased: product,
    ctx,
  })

  const userPurchases = await getPurchasesForUser(userId)

  const price = await getPrice({where: {productId}})

  if (!price) throw new PriceFormattingError(`no-price-found`, noContextOptions)

  const pppDiscountPercent = getPPPDiscountPercent(country)

  // TODO: give this function a better name like, `determineCouponDetails`
  const {appliedMerchantCoupon, appliedCouponType, ...result} =
    await determineCouponToApply({
      prismaCtx: ctx,
      merchantCouponId,
      country,
      quantity,
      userId,
      productId: product.id,
      purchaseToBeUpgraded: upgradeFromPurchase,
    })

  const unitPrice: number = price.unitAmount.toNumber()
  const fullPrice: number = unitPrice * quantity - fixedDiscountForUpgrade

  let defaultPriceProduct: FormattedPrice = {
    ...product,
    quantity,
    unitPrice,
    fullPrice,
    calculatedPrice: getCalculatedPriced({
      unitPrice: price.unitAmount.toNumber(),
      ...(upgradeFromPurchase && {
        fixedDiscount: fixedDiscountForUpgrade,
      }),
      quantity,
    }),
    availableCoupons: result.availableCoupons,
    ...(upgradeFromPurchase && {
      upgradeFromPurchaseId,
      upgradeFromPurchase,
      upgradedProduct,
    }),
  }

  if (appliedMerchantCoupon?.type === 'special') {
    defaultPriceProduct = {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
        quantity,
      }),
      appliedMerchantCoupon: appliedMerchantCoupon,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
        upgradedProduct,
      }),
    }
  }

  // no ppp or bulk if you're applying a code
  if (code) {
    const coupon = await couponForIdOrCode({code})

    if (!coupon || !coupon.merchantCoupon)
      throw new PriceFormattingError(`no-coupon`, noContextOptions)

    if (coupon && coupon.merchantCoupon) {
      if (coupon.restrictedToProductId !== productId) {
        throw new PriceFormattingError(
          'coupon-not-valid-for-product',
          noContextOptions,
        )
      }

      const {merchantCoupon} = coupon

      const calculatedPrice = getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: merchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      })

      return {
        ...defaultPriceProduct,
        calculatedPrice,
        appliedMerchantCoupon: merchantCoupon,
        ...(upgradeFromPurchase && {
          upgradeFromPurchaseId,
          upgradeFromPurchase,
          upgradedProduct,
        }),
      }
    }
  } else if (appliedCouponType === 'ppp' && appliedMerchantCoupon) {
    const {identifier, merchantAccountId, ...merchantCouponWithoutIdentifier} =
      appliedMerchantCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      appliedMerchantCoupon: merchantCouponWithoutIdentifier,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
        upgradedProduct,
      }),
    }
  } else if (
    appliedMerchantCoupon &&
    appliedMerchantCoupon.type === 'special' &&
    result?.pppDetails.pppAvailable
  ) {
    const {identifier, merchantAccountId, ...merchantCouponWithoutIdentifier} =
      appliedMerchantCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      appliedMerchantCoupon: merchantCouponWithoutIdentifier,
      availableCoupons: result.availableCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
        upgradedProduct,
      }),
    }
  } else if (result?.pppDetails.pppAvailable) {
    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      availableCoupons: result.availableCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
        upgradedProduct,
      }),
    }
  } else if (result.bulkDiscountDetails.bulkDiscountAvailable) {
    const bulkCoupons = await couponForType(
      'bulk',
      result.bulkDiscountDetails.bulkCouponPercent,
      ctx,
    )
    const bulkCoupon = bulkCoupons[0]

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: bulkCoupon.percentageDiscount.toNumber(),
        quantity,
      }),
      ...(bulkCoupon && {appliedMerchantCoupon: bulkCoupon}),
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

  type MerchantCoupon = (typeof merchantCoupons)[0]

  return merchantCoupons.map((coupon: MerchantCoupon) => {
    // for pricing we don't need the identifier so strip it here
    const {identifier, ...rest} = coupon
    return {...rest, ...(country && {country})}
  })
}
