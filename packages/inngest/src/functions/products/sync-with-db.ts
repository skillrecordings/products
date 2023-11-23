import {SYNC_SANITY_PRODUCT} from '../../events'
import {inngest} from '../../inngest.server'
import {getSdk} from '@skillrecordings/database'

export const syncSanityProductsWithDb = inngest.createFunction(
  {id: `sync-sanity-product-with-db`, name: 'Sync Sanity Product with DB'},
  {event: SYNC_SANITY_PRODUCT},
  async ({event, step}) => {
    const {product, sanityTransactionTime} = event.data
    const {updateOrCreateProduct, deleteProduct} = getSdk()

    // sanity isn't sending any delete event headers,
    // but we can write a projection grabbing state AFTER it ran,
    // which indicates if delete event has occured
    const isDeleteEvent = product.afterProductId === null

    if (isDeleteEvent) {
      await deleteProduct({
        where: {
          id: product.productId,
        },
      })
      return `${product.productId} deleted`
    } else {
      const newProduct = await updateOrCreateProduct({
        where: {
          id: product.productId,
        },
        create: {
          id: product.productId,
          name: product.title,
          createdAt: product._createdAt,
          status: product.state === 'active' ? 1 : 0,
          quantityAvailable: -1,
          // TODO: upgradableTo, coupons
          ...(product.price && {
            prices: {
              connectOrCreate: {
                where: {
                  id: product.price.priceId,
                },
                create: {
                  id: product.price.priceId,
                  unitAmount: product.price.amount,
                  merchantPrices: {
                    connectOrCreate: {
                      where: {
                        id: product.merchantPrice.merchantPriceId,
                      },
                      create: {
                        id: product.merchantPrice.merchantPriceId,
                        identifier: product.merchantPrice.identifier,
                        merchantProductId: product.productId,
                        merchantAccountId:
                          product.merchantPrice.merchantAccountId,
                      },
                    },
                  },
                },
              },
            },
          }),
          ...(product.merchantProduct && {
            merchantProducts: {
              connectOrCreate: {
                where: {
                  id: product.merchantProduct.merchantProductId,
                },
                create: {
                  id: product.merchantProduct.merchantProductId,
                  identifier: product.merchantProduct.identifier,
                  merchantAccountId: product.merchantProduct.merchantAccountId,
                },
              },
            },
          }),
        },
        update: {
          name: product.title,
          status: product.state === 'active' ? 1 : 0,
          quantityAvailable: -1,
          ...(product.price && {
            prices: {
              connectOrCreate: {
                where: {
                  id: product.price.priceId,
                },
                create: {
                  id: product.price.priceId,
                  unitAmount: product.price.amount,
                  merchantPrices: {
                    connectOrCreate: {
                      where: {
                        id: product.merchantPrice.merchantPriceId,
                      },
                      create: {
                        id: product.merchantPrice.merchantPriceId,
                        identifier: product.merchantPrice.identifier,
                        merchantProductId: product.productId,
                        merchantAccountId:
                          product.merchantPrice.merchantAccountId,
                      },
                    },
                  },
                },
              },
            },
          }),
          ...(product.merchantProduct && {
            merchantProducts: {
              connectOrCreate: {
                where: {
                  id: product.merchantProduct.merchantProductId,
                },
                create: {
                  id: product.merchantProduct.merchantProductId,
                  identifier: product.merchantProduct.identifier,
                  merchantAccountId: product.merchantProduct.merchantAccountId,
                },
              },
            },
          }),
        },
      })

      return {newProduct, product}
    }
  },
)
