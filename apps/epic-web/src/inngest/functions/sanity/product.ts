import {getSdk} from '@skillrecordings/database'
import {inngest} from 'inngest/inngest.server'
import {updateOrCreateSanityProduct} from 'lib/products'
import {SANITY_WEBHOOK_EVENT} from 'inngest/events/sanity'
import groq from 'groq'
import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})

async function getProduct(id: string): Promise<any> {
  const product = await sanityClient.fetch(
    groq`*[_type == "product" && _id == $id][0] {
          _id,
          _type,
          _updatedAt,
          _createdAt,
          productId,
          title,
          image,
          state,
          "slug": slug.current,
          body,
          upgradableTo[]->{
            ...,
          },
          modules[]->{
            ...,
          }
    }`,
    {id},
  )
  return product
}

export const sanityProductUpdated = inngest.createFunction(
  {id: `product-update`, name: 'Update Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.update"',
  },
  async ({event, step}) => {
    const productToUpdate = await step.run('get product', async () => {
      return await getProduct(event.data._id)
    })

    const product = await step.run('update product in database', async () => {
      return await updateOrCreateSanityProduct(productToUpdate)
    })

    return {product}
  },
)

export const sanityProductCreated = inngest.createFunction(
  {id: `product-create`, name: 'Create Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.create"',
  },
  async ({event, step}) => {
    const productToUpdate = await step.run('get product', async () => {
      return await getProduct(event.data._id)
    })

    const product = await step.run('create product in database', async () => {
      return await updateOrCreateSanityProduct(productToUpdate)
    })

    await step.run('update productId in sanity', async () => {
      return await sanityClient
        .patch(event.data._id)
        .set({
          productId: product.id,
        })
        .commit()
    })

    return {product}
  },
)

export const sanityProductDeleted = inngest.createFunction(
  {id: `product-delete`, name: 'Delete Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.delete"',
  },
  async ({event, step}) => {
    const {deleteProduct} = getSdk()

    await step.run('delete product', async () => {
      return await deleteProduct({
        where: {
          id: event.data._id,
        },
      })
    })

    return `${event.data._id} deleted`
  },
)

export const productFunctions = [
  sanityProductCreated,
  sanityProductUpdated,
  sanityProductDeleted,
]
