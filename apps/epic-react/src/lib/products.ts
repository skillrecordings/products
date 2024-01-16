import z from 'zod'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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
    .optional()
    .nullable(),
  productId: z.string().optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['draft', 'active', 'unavailable']),
  modules: z.array(z.any()).optional().nullable(),
})

export const ProductsSchema = z.array(ProductSchema)

export type Product = z.infer<typeof ProductSchema>

export async function getProduct(productId: string): Promise<Product | null> {
  const product = await sanityClient.fetch(
    groq`*[_type == "product" && productId == $productId][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        productId,
        title,
        "image": image.asset->{url, alt},
        state,
        "slug": slug.current,
        body,
        modules[]->{
          ...,
          "image": {"url": image.secure_url},
        }
  }`,
    {productId},
  )

  if (!product) return null

  return ProductSchema.parse(product)
}

export const getAllProducts = async () => {
  const products = await sanityClient.fetch(
    groq`*[_type == 'product'][]{
    _id,
    title,
    description,
    productId,
    state,
    "slug": slug.current,
    _id,
    image {
      url,
      alt
    },
    "modules" : modules[]->{
      title,
      moduleType,
      "slug": slug.current,
      "image": {"url": image.secure_url},
      state,
    },
    "bonuses": *[_type == 'bonus'][]{...},
    "features" : features[]{
    value
   }
    }`,
  )
  return products
}

export const getPricing = async (slug: string = 'primary') => {
  const pricing = await sanityClient.fetch(
    groq`*[_type == 'pricing' && slug.current == $slug][0]{
    _id,
    title,
    subtitle,
    slug,
    "products": products[]->{
      _id,
      title,
      description,
      productId,
      state,
      "slug": slug.current,
      _id,
      image {
        url,
        alt
      },
      "modules" : modules[]->{
        title,
        moduleType,
        "slug": slug.current,
        "image": {"url": image.secure_url},
        state,
      },
      "bonuses": *[_type == 'bonus'][]{...},
      "features" : features[]{
      value
    }
    }
    }`,
    {
      slug: slug,
    },
  )
  if (!pricing) {
    return null
  }
  return pricing
}
