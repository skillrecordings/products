import z from 'zod'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const ProductSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  image: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  ogImage: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  productId: z.string().optional(),
  body: z.nullable(z.string()).optional(),
  type: z.enum(['live', 'self-paced']),
  state: z.enum(['draft', 'active', 'unavailable', 'archived']),
  modules: z.array(z.any()).optional(),
  upgradableTo: z.any(),
  welcomeVideo: z
    .object({
      muxPlaybackId: z.string(),
      poster: z.string().optional().nullable(),
    })
    .nullable(),
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
        description,
        type,
        image,
        action,
        ogImage,
        state,
        type,
        "slug": slug.current,
        body,
        "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
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
          "instructors": contributors[@.role == 'instructor'].contributor->{
              ...,
              picture {
                "url": asset->url,
                alt
              }, 
              "slug": slug.current,
          },
        }
  }`,
    {productId},
  )

  return ProductSchema.parse(product)
}
