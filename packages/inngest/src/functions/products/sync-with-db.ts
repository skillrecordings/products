import {SYNC_SANITY_PRODUCT} from '../../events'
import {inngest} from '../../inngest.server'
import {getSdk} from '@skillrecordings/database'
import {getProduct, updateOrCreateSanityProduct} from '../../lib/products'

export const syncSanityProductsWithDb = inngest.createFunction(
  {id: `sync-sanity-product-with-db`, name: 'Sync Sanity Product with DB'},
  {event: SYNC_SANITY_PRODUCT},
  async ({event, step}) => {
    const data = event.data

    const {deleteProduct} = getSdk()

    const isDeleteEvent = data.event.includes('delete')
    const documentType = data._type
    const documentId = data._id
    const product = await getProduct(documentId)

    if (product) {
      if (isDeleteEvent) {
        await deleteProduct({
          where: {
            id: product.productId,
          },
        })
        return `${product.productId} deleted`
      } else {
        const newProduct = await updateOrCreateSanityProduct(product)
        return {newProduct, product}
      }
    }
  },
)
