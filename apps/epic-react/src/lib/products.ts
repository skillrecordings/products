import z from 'zod'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const ProductSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  slug: z.string(),
  image: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
    })
    .optional()
    .nullable(),
  ogImage: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  productId: z.string().optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['draft', 'active', 'unavailable', 'archived']),
  type: z
    .enum(['live', 'self-paced'])
    .default('self-paced')
    .optional()
    .nullable(),
  modules: z.array(z.any()).optional(),
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
        description,
        action,
        type,
        "image": image.asset->{url, alt},
        state,
        "slug": slug.current,
        body,
        modules[]->{
          ...,
          "image": image.url,
        }
  }`,
    {productId},
  )

  if (!product) return null

  return ProductSchema.parse(product)
}

export const getProductBySlug = async (productSlug: string) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && slug.current == $productSlug][0] {
  "name": title,
  "slug": slug.current,
  productId,
  description,
  state,
  type,
  title,
  body,
  _createdAt,
  action,
  "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
  image {
    url,
    alt
  },
  ogImage,
  modules[]->{
    "slug": slug.current,
    "instructors": contributors[@.role == 'instructor'].contributor->{
              ...,
              "slug": slug.current,
          },
    moduleType,
    title,
    "image": {
      "url": image.url
    },
    state,
    "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
      ..., "slug": slug.current},
    "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
      _id,
      _type,
      _updatedAt,
      "slug": slug.current,
      title,
      description,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        "slug": slug.current,
      }
    },
    "resources": resources[@->._type in ['linkResource']]->
  }
  },
  features[]{
    value
  }
    }`,
    {
      productSlug,
    },
  )

  return product
}

export const getAllActiveProducts = async (activeOnly: boolean = true) => {
  const products = await sanityClient.fetch(
    groq`*[_type == 'product'${
      activeOnly ? "&& state == 'active'" : "&& state != 'unavailable'"
    }][]{
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
      value,
      icon
    }
  }`,
  )
  return products
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
      "image": {"url": image.url},
      state,
    },
    "bonuses": *[_type == 'bonus'][]{...},
    "features" : features[]{
      value,
      icon
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
