import {prisma} from '@skillrecordings/database'
import {inngest} from 'inngest/inngest.server'
import {SANITY_WEBHOOK_EVENT} from 'inngest/events/sanity'
import groq from 'groq'
import {createClient} from '@sanity/client'
import z from 'zod'
import {v4} from 'uuid'
import {stripe} from '@skillrecordings/commerce-server'
import {sanityProductCreated} from './sanity-product-created'
import {sanityProductUpdated} from './sanity-product-updated'
import {sanityWriteClient} from 'utils/sanity-server'

export const loadSanityProduct = async (id: string) => {
  const sanityProductData = await sanityWriteClient.fetch(
    groq`*[_type == "product" && _id == $id][0] {
          _id,
          productId,
          unitAmount,
          title,
          "slug": slug.current,
          quantityAvailable,
          upgradableTo[]->
    }`,
    {id},
  )

  return BaseSanityProductSchema.parse(sanityProductData)
}

export const BaseSanityProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  unitAmount: z.number().default(0),
  quantityAvailable: z.number().default(-1),
  productId: z.string().optional(),
  upgradableTo: z.array(z.any()).nullable().optional(),
})

export type BaseSanityProduct = z.infer<typeof BaseSanityProductSchema>

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
