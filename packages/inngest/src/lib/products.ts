import {getSdk} from '@skillrecordings/database'
import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function updateOrCreateSanityProduct(product: any) {
  const {updateOrCreateProduct} = getSdk()
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
                    merchantAccountId: product.merchantPrice.merchantAccountId,
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
                    merchantAccountId: product.merchantPrice.merchantAccountId,
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
  return newProduct
}

export async function getProduct(id: string): Promise<any> {
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
