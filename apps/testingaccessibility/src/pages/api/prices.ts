import type {NextApiRequest, NextApiResponse} from 'next'
import {getAdminSDK} from '../../lib/api'
import {getPPPDiscountPercent} from '../../utils/parity-coupon'
import {getBulkDiscountPercent} from '../../utils/bulk-coupon'

async function couponForType(type: string, percentage_discount: number) {
  const {getCouponsForTypeAndDiscount} = getAdminSDK()
  const {merchant_coupons} = await getCouponsForTypeAndDiscount({
    type,
    percentage_discount,
  })

  return merchant_coupons.map((coupon) => {
    // for pricing we don't need the identifier so strip it here
    const {identifier, ...rest} = coupon
    return rest
  })
}

function calculateDiscount(totalPrice: number, percentOfDiscount: number) {
  return Number((totalPrice * percentOfDiscount).toFixed(2))
}

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {getProduct, getCouponForCode, getMerchantCoupon} = getAdminSDK()

      let availableCoupons: any[] = []
      let appliedCoupons: any[] = []
      let product: any

      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

      console.log(`request from ${country}`)

      const {code, quantity = 1, productId, coupon} = req.body

      if (quantity > 101) {
        throw new Error(
          'Please contact support and we will help you with your team order ASAP!',
        )
      }

      if (!productId) {
        throw new Error('A product ID is required.')
      }

      const pppDiscountPercent = getPPPDiscountPercent(country)
      const bulkCouponPercent = getBulkDiscountPercent(quantity)
      const {products_by_pk: loadedProduct} = await getProduct({id: productId})

      if (!loadedProduct) {
        throw new Error('No product was found')
      }

      const {prices, ...noPricesProduct} = loadedProduct
      const firstPrice = prices[0]
      const defaultPriceProduct = {
        ...noPricesProduct,
        quantity,
        price: firstPrice.unit_amount,
        calculatedPrice: firstPrice.unit_amount * quantity,
      }

      product = defaultPriceProduct

      // no ppp or bulk if you're applying a code
      if (code) {
        const {coupons} = await getCouponForCode({code})
        if (coupons[0]) {
          const coupon = coupons[0]

          if (coupon.restricted_to_product_id != productId) {
            throw new Error('Invalid coupon.')
          }

          const calculatedPrice =
            defaultPriceProduct.price -
            calculateDiscount(
              defaultPriceProduct.price,
              coupon.percentage_discount,
            )

          product = {
            ...defaultPriceProduct,
            calculatedPrice,
          }

          if (!appliedCoupons.includes(coupon)) {
            appliedCoupons.push(coupon)
          }
        }
      } else if (quantity === 1 && coupon && pppDiscountPercent > 0) {
        const {merchant_coupons_by_pk: merchantCoupon} =
          await getMerchantCoupon({id: coupon})

        const invalidCoupon =
          pppDiscountPercent !== merchantCoupon?.percentage_discount

        if (invalidCoupon || !merchantCoupon) throw new Error('Invalid coupon')

        product = {
          ...defaultPriceProduct,
          calculatedPrice:
            defaultPriceProduct.price -
            calculateDiscount(
              defaultPriceProduct.price,
              merchantCoupon.percentage_discount,
            ),
        }
        if (!appliedCoupons.includes(merchantCoupon)) {
          const {identifier, ...rest} = merchantCoupon
          appliedCoupons.push(rest)
        }
      } else if (quantity === 1 && pppDiscountPercent > 0) {
        // no PPP for bulk
        const pppCoupons = await couponForType('ppp', pppDiscountPercent)
        availableCoupons = [...availableCoupons, ...pppCoupons]
      } else if (bulkCouponPercent > 0) {
        const bulkCoupons = await couponForType('bulk', bulkCouponPercent)
        const bulkCoupon = bulkCoupons[0]

        product = {
          ...defaultPriceProduct,
          calculatedPrice:
            (defaultPriceProduct.price -
              calculateDiscount(
                defaultPriceProduct.price,
                bulkCoupon.percentage_discount,
              )) *
            quantity,
        }

        if (bulkCoupon) {
          if (!appliedCoupons.includes(bulkCoupon)) {
            appliedCoupons.push(bulkCoupon)
          }
        }
      }

      res.status(200).json({
        ...product,
        availableCoupons,
        appliedCoupons,
      })
    } catch (error: any) {
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default pricesHandler

// pricing response with bulk discount applied
// shows the standard unit price of the Product
// and the calculated "on server" price of whatever
// is selected
// [
// {
//   "slug": "epic-react-pro-e28f",
//   "full_price": 599,
//   "price": 3414,
//   "bulk_discount": 0.05,
//   "url": "https://app.egghead.io/api/v1/playlists/epic-react-pro-e28f"
// }
// ]

// @pricing = Pricing::Calculator.call(
//   site: site_name,
//   product: subscription_plan,
//   code: params[:coupon],
//   quantity: params.fetch(:quantity, 1).to_i,
//   ip_address: request.remote_ip
// )

// QUANTITY_DISCOUNT_BRACKETS = [
//   [1..4,                 0.0],
//   [5..9,                 0.05],
//   [10..29,               0.10],
//   [30..49,               0.15],
//   [50..79,               0.25],
//   [80..99,               0.35],
//   [100..Float::INFINITY, 0.45],
// ]

// def prices
// @sellables = prices_params[:sellables]
// .map do |sellable_params|
// [
//   Sellable.find_sellable(sellable_params[:sellable], sellable_params[:sellable_id]),
// sellable_params.fetch(:quantity, 1).to_i
// ]
// end
//
// applied_coupon = find_coupon(prices_params[:site], prices_params[:code])
// available_coupons = find_available_coupons(prices_params[:site], request.remote_ip)
//
// @prices = @sellables.map do |sellable, quantity|
// {
//   sellable: sellable,
//   price_info: sellable.price_with_coupon(
//     applied_coupon,
//     quantity,
//     available_coupons
//   )
// }
// end
// rescue Coupon::InvalidCoupon => e
// render json: {error: e.message}, status: 400
// end

// def price_with_coupon(applied_coupon = nil, quantity = 1, available_coupons = [], site=nil)
// info = PriceInfo.new
// info.price = price || 0
//
// info.coupon = applied_coupon || Coupon.default_for_site(site || self.site)
// info.available_coupons = available_coupons.map { |coupon| self.price_with_coupon(coupon) }
//
// if info.coupon.present?
//   if info.coupon.expired? && !info.coupon.default?
//   info.coupon_error = 'Your coupon code has expired.'
//   end
//
// if info.coupon.used_up?
//   info.coupon_error = 'The coupon code you are using has reached its use limit and is exhausted.'
//   if info.coupon.generated_by_purchase_id.present?
//     purchase = info.coupon.generated_by_purchase
//     info.coupon_error = "The coupon code you are using has reached its use limit and is exhausted. Please contact #{purchase.user.email} and let them know you'd like access."
//     end
// end
//
// if !info.coupon.compatible_with?(self)
//   info.coupon_error = 'This coupon code is invalid.'
//   end
//
// if info.coupon_error.nil? and !price.nil?
//   info.price = (price * (1 - info.coupon.percent_off)).to_i
//   end
//   end
//
// if quantity > 1
//   base_price = info.price
// discount = QUANTITY_DISCOUNT_BRACKETS.detect { |range, _| range.include?(quantity) }.last
//

// total_price = (base_price * (1 - discount)).to_i * quantity
//
// info.bulk_discount = discount
// info.price = total_price
// end
//
// return info
// end
