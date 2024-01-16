import {inngest} from 'inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'
import {SANITY_WEBHOOK_EVENT} from '../sanity-inngest-events'

export const sanityProductDeleted = inngest.createFunction(
  {id: `product-delete`, name: 'Deactivate Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.delete"',
  },
  async ({event, step}) => {
    const {productId} = event.data

    if (!productId) {
      throw new Error(`Product id not found`)
    }

    const product = await step.run('get product in database', async () => {
      return await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          prices: true,
        },
      })
    })

    if (!product) {
      throw new Error(`Product not found [${productId}]`)
    }

    await step.run('deactivate product', async () => {
      return await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          status: 0,
          name: `(DEACTIVATED) ${product.name}`,
        },
      })
    })

    await step.run('deactivate prices', async () => {
      return await Promise.all(
        product.prices.map(async (price) => {
          return await prisma.price.update({
            where: {
              id: price.id,
            },
            data: {
              status: 0,
              nickname: `(DEACTIVATED) ${price.nickname}`,
            },
          })
        }),
      )
    })

    const merchantProduct = await step.run('get merchant product', async () => {
      return await prisma.merchantProduct.findFirst({
        where: {
          productId,
        },
        include: {
          merchantPrices: true,
        },
      })
    })

    if (!merchantProduct) {
      throw new Error(
        `Merchant Product not found for product id [${productId}]`,
      )
    }

    await step.run('deactivate merchant product', async () => {
      return await prisma.merchantProduct.update({
        where: {
          id: merchantProduct.id,
        },
        data: {
          status: 0,
        },
      })
    })

    await step.run('deactivate merchant prices', async () => {
      return await Promise.all(
        merchantProduct.merchantPrices.map(async (merchantPrice) => {
          return await prisma.merchantPrice.update({
            where: {
              id: merchantPrice.id,
            },
            data: {
              status: 0,
            },
          })
        }),
      )
    })

    const stripeProduct = await step.run('get stripe product', async () => {
      if (!merchantProduct?.identifier) {
        throw new Error('Merchant Product not found')
      }
      return await stripe.products.retrieve(merchantProduct.identifier)
    })

    await step.run('deactivate stripe product', async () => {
      return await stripe.products.update(stripeProduct.id, {
        active: false,
      })
    })

    await step.run('delete product upgrades', async () => {
      return await prisma.upgradableProducts.deleteMany({
        where: {
          OR: [
            {
              upgradableFromId: product.id,
            },
            {
              upgradableToId: product.id,
            },
          ],
        },
      })
    })

    await step.run('deactivate all stripe prices', async () => {
      return await Promise.all(
        merchantProduct.merchantPrices.map(async (merchantPrice) => {
          if (merchantPrice.identifier) {
            return stripe.prices.update(merchantPrice.identifier, {
              active: false,
            })
          } else {
            return Promise.resolve()
          }
        }),
      )
    })
  },
)
