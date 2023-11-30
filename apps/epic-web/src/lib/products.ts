import z from 'zod'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {getSdk} from '@skillrecordings/database'

export const ProductSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  productId: z.string().optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['draft', 'active', 'unavailable']),
  modules: z.array(z.any()).optional(),
  upgradableTo: z.array(z.any()).nullable().optional(),
})

export const ProductsSchema = z.array(ProductSchema)

export type Product = z.infer<typeof ProductSchema>

export async function getProduct(productId: string): Promise<Product> {
  const product = await sanityClient.fetch(
    groq`*[_type == "product" && productId == $productId][0] {
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
          modules[]->{
            ...,
            "description": "",
            "image": image.asset->{url},
          }  
        },
        modules[]->{
          ...,
          "image": image.asset->{url},
        }
  }`,
    {productId},
  )

  return ProductSchema.parse(product)
}

export async function updateOrCreateSanityProduct(product: any) {
  const {updateOrCreateProduct} = getSdk()
  const newProduct = await updateOrCreateProduct({
    where: {
      id: product.productId ? product.productId : product._id,
    },
    create: {
      id: product._id,
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
