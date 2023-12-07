import {inngest} from 'inngest/inngest.server'
import {SANITY_WEBHOOK_EVENT} from 'inngest/events/sanity'
import {prisma} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'
import {v4} from 'uuid'
import {loadSanityProduct} from './index'

export const sanityProductUpdated = inngest.createFunction(
  {id: `product-update`, name: 'Update Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.update"',
  },
  async ({event, step}) => {
    const sanityProduct = await step.run('get sanity product', async () => {
      return loadSanityProduct(event.data._id)
    })

    const product = await step.run('get product in database', async () => {
      return await prisma.product.findUnique({
        where: {
          id: sanityProduct.productId,
        },
        include: {
          prices: true,
        },
      })
    })

    if (!product) {
      throw new Error(`Product not found [${sanityProduct.productId}]`)
    }

    const merchantProduct = await step.run('get merchant product', async () => {
      return await prisma.merchantProduct.findFirst({
        where: {
          productId: product.id,
        },
      })
    })

    if (!merchantProduct) {
      throw new Error(
        `Merchant Product not found for product id [${product.id}]`,
      )
    }

    const stripeProduct = await step.run('get stripe product', async () => {
      if (!merchantProduct?.identifier) {
        throw new Error('Merchant Product not found')
      }
      return await stripe.products.retrieve(merchantProduct.identifier)
    })

    const priceChanged = product.prices
      .map((price) => Number(price.unitAmount))
      .includes(sanityProduct.unitAmount)

    if (priceChanged) {
      const currentMerchantPrice = await step.run(
        'get current merchant price',
        async () => {
          return await prisma.merchantPrice.findFirst({
            where: {
              priceId: product.prices[0].id,
            },
          })
        },
      )

      const currentStripePrice = await step.run(
        'get stripe price',
        async () => {
          if (!currentMerchantPrice?.identifier) {
            throw new Error('Merchant Price not found')
          }
          return await stripe.prices.retrieve(currentMerchantPrice.identifier)
        },
      )

      const newStripePrice = await step.run(
        'create new stripe price',
        async () => {
          return await stripe.prices.create({
            unit_amount: Math.floor(Number(sanityProduct.unitAmount) * 100),
            currency: 'usd',
            product: stripeProduct.id,
            active: true,
          })
        },
      )

      await step.run('create new merchant price', async () => {
        const newMerchantPriceId = v4()
        return await prisma.merchantPrice.create({
          data: {
            id: newMerchantPriceId,
            merchantProductId: merchantProduct.id,
            priceId: product.prices[0].id,
            merchantAccountId: merchantProduct.merchantAccountId,
            identifier: newStripePrice.id,
            status: 1,
          },
        })
      })

      if (currentMerchantPrice) {
        await step.run('deactivate old merchant price', async () => {
          return await prisma.merchantPrice.update({
            where: {
              id: currentMerchantPrice.id,
            },
            data: {
              status: 0,
            },
          })
        })
      }

      await step.run('update price in database', async () => {
        return await prisma.price.update({
          where: {
            id: product.prices[0].id,
          },
          data: {
            nickname: sanityProduct.title,
            unitAmount: sanityProduct.unitAmount,
          },
        })
      })

      if (currentStripePrice) {
        await step.run('deactivate stripe price', async () => {
          return await stripe.prices.update(currentStripePrice.id, {
            active: false,
          })
        })
      }
    }

    const updatedProduct = await step.run(
      'update product in database',
      async () => {
        return await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            name: sanityProduct.title,
            quantityAvailable: sanityProduct.quantityAvailable,
          },
          include: {
            prices: true,
            merchantProducts: true,
          },
        })
      },
    )

    return {updatedProduct}
  },
)
