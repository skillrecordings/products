import {prisma} from '@skillrecordings/database'
import {inngest} from 'inngest/inngest.server'
import {SANITY_WEBHOOK_EVENT} from 'inngest/events/sanity'
import groq from 'groq'
import {createClient} from '@sanity/client'
import z from 'zod'
import {v4} from 'uuid'
import {stripe} from '@skillrecordings/commerce-server'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})

const BaseSanityProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  unitAmount: z.number().default(0),
  quantityAvailable: z.number().default(-1),
  productId: z.string().optional(),
  upgradableTo: z.array(z.any()).nullable().optional(),
})

export type BaseSanityProduct = z.infer<typeof BaseSanityProductSchema>

export const sanityProductCreated = inngest.createFunction(
  {id: `product-create`, name: 'Create Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.create"',
  },
  async ({event, step}) => {
    const sanityProduct = await step.run('get sanity product', async () => {
      const sanityProductData = await sanityClient.fetch(
        groq`*[_type == "product" && _id == $id][0] {
          _id,
          productId,
          unitAmount,
          title,
          "slug": slug.current,
          quantityAvailable,
          upgradableTo[]->
    }`,
        {id: event.data._id},
      )

      return BaseSanityProductSchema.parse(sanityProductData)
    })

    // we should just have a title

    const product = await step.run('create product in database', async () => {
      const newProductId = v4()
      return await prisma.product.create({
        data: {
          id: newProductId,
          name: sanityProduct.title,
          quantityAvailable: sanityProduct.quantityAvailable,
        },
      })
    })

    await step.run('update productId in sanity', async () => {
      return await sanityClient
        .patch(event.data._id)
        .set({
          productId: product.id,
        })
        .commit()
    })

    const price = await step.run('create price in database', async () => {
      const newPriceId = v4()
      return await prisma.price.create({
        data: {
          id: newPriceId,
          unitAmount: sanityProduct.unitAmount,
          productId: product.id,
          nickname: sanityProduct.title,
        },
      })
    })

    const merchantAccount = await step.run('get merchant account', async () => {
      return await prisma.merchantAccount.findFirst({
        where: {
          label: 'stripe',
        },
      })
    })

    if (merchantAccount) {
      const stripeProduct = await step.run(
        'create stripe product',
        async () => {
          return await stripe.products.create({
            name: product.name,
            metadata: {
              slug: sanityProduct.slug,
            },
          })
        },
      )

      const stripePrice = await step.run('create stripe price', async () => {
        return await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.floor(Number(price.unitAmount) * 100),
          currency: 'usd',
          nickname: sanityProduct.title,
          metadata: {
            slug: sanityProduct.slug,
          },
        })
      })

      const merchantProduct = await step.run(
        'create merchant product in database',
        async () => {
          const newMerchantProductId = v4()
          return await prisma.merchantProduct.create({
            data: {
              id: newMerchantProductId,
              productId: product.id,
              merchantAccountId: merchantAccount.id,
              identifier: stripeProduct.id,
            },
          })
        },
      )

      const merchantPrice = await step.run(
        'create merchant product in database',
        async () => {
          const newMerchantPriceId = v4()
          return await prisma.merchantPrice.create({
            data: {
              id: newMerchantPriceId,
              merchantProductId: merchantProduct.id,
              priceId: price.id,
              merchantAccountId: merchantAccount.id,
              identifier: stripePrice.id,
            },
          })
        },
      )

      return {
        product,
        merchantProduct,
        merchantPrice,
        price,
        stripeProduct,
        stripePrice,
      }
    } else {
      throw new Error('No merchant account found')
    }
  },
)

export const sanityProductUpdated = inngest.createFunction(
  {id: `product-update`, name: 'Update Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.update"',
  },
  async ({event, step}) => {
    return false
  },
)

export const sanityProductDeleted = inngest.createFunction(
  {id: `product-delete`, name: 'Delete Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.delete"',
  },
  async ({event, step}) => {
    return false
  },
)

export const productFunctions = [
  sanityProductCreated,
  sanityProductUpdated,
  sanityProductDeleted,
]
