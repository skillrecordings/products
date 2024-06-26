import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import {ProductSchema} from './products'

const PricingSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  products: z.array(ProductSchema),
})

export const getPricing = async (slug: string = 'primary') => {
  const pricing = await sanityClient.fetch(
    groq`*[_type == 'pricing' && slug.current == $slug][0]{
    _id,
    title,
    subtitle,
    "slug": slug.current,
    "products": products[@->.state == 'active']->{
      _id,
      _type,
      _updatedAt,
      _createdAt,
      title,
      description,
      productId,
      action,
      type,
      state,
      "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
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
        "image": image.asset->{url},
        state,
      },
      "bonuses": *[_type == 'bonus'][]{...},
      "features": features[]{
        value,
        icon
      }
    }
    }`,
    {
      slug: slug,
    },
  )

  const parsedPricing = PricingSchema.safeParse(pricing)

  if (!parsedPricing.success) {
    console.error(parsedPricing.error)
    return null
  }

  return parsedPricing.data
}
