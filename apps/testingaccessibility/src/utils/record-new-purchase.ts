import {getAdminSDK} from '../lib/api'
import {stripe} from './stripe'
import {Stripe} from 'stripe'
import {first, isEmpty} from 'lodash'

export async function recordNewPurchase(checkoutSessionId: string) {
  const {
    QueryUser,
    CreateUser,
    getMerchantProductByIdentifier,
    createPurchase,
    createMerchantCharge,
    createMerchantCustomer,
    getMerchantCustomerForUser,
    getMerchantCharge,
  } = getAdminSDK()

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId,
    {
      expand: [
        'customer',
        'line_items.data.price.product',
        'payment_intent.charges',
      ],
    },
  )

  const {users} = await QueryUser({
    where: {
      email: {
        _eq: checkoutSession.customer_details?.email,
      },
    },
  })

  let user

  const {customer, line_items, payment_intent} = checkoutSession
  const {email, name, id: stripeCustomerId} = customer as Stripe.Customer

  const lineItem = first(line_items?.data) as Stripe.LineItem
  const stripePrice = lineItem.price
  const stripeProduct = stripePrice?.product as Stripe.Product
  const {charges} = payment_intent as Stripe.PaymentIntent

  const {merchant_products} = await getMerchantProductByIdentifier({
    identifier: stripeProduct?.id,
  })

  const merchantProduct = merchant_products?.[0]

  if (isEmpty(users)) {
    const {insert_users_one} = await CreateUser({
      data: {email, name},
    })
    user = insert_users_one
  } else {
    user = users?.[0]
  }

  let merchantCustomer

  const {merchant_customers} = await getMerchantCustomerForUser({
    user_id: user?.id,
  })

  if (merchant_customers?.length > 0) {
    merchantCustomer = merchant_customers?.[0]
  } else {
    const {insert_merchant_customers_one} = await createMerchantCustomer({
      data: {
        identifier: stripeCustomerId,
        user_id: user?.id,
        merchant_account_id: merchantProduct.merchant_account_id,
      },
    })
    merchantCustomer = insert_merchant_customers_one
  }

  const chargeId = first<Stripe.Charge>(charges.data)?.id as string

  const {merchant_charges} = await getMerchantCharge({
    identifier: chargeId,
  })

  let purchase

  if (isEmpty(merchant_charges)) {
    const {insert_merchant_charges_one} = await createMerchantCharge({
      data: {
        identifier: first<Stripe.Charge>(charges.data)?.id,
        merchant_product_id: merchantProduct.id,
        merchant_account_id: merchantProduct.merchant_account_id,
        merchant_customer_id: merchantCustomer?.id,
        user_id: user?.id,
      },
    })

    const {insert_purchases_one} = await createPurchase({
      data: {
        user_id: user?.id,
        product_id: merchantProduct.product_id,
        merchant_charge_id: insert_merchant_charges_one?.id,
      },
    })

    purchase = insert_purchases_one
  } else {
    purchase = merchant_charges?.[0].purchases?.[0]
  }

  return {purchase, user}
}
