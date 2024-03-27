import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const ContributorRoleSchema = z.enum([
  'author',
  'instructor',
  'host',
  'presenter',
  'editor',
  'reviewer',
  'illustrator',
])

export const ContributorSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string().optional().nullable(),
  twitterHandle: z.string().optional().nullable(),
  links: z
    .array(
      z.object({
        label: z.string().optional().nullable(),
        url: z.string(),
      }),
    )
    .optional()
    .nullable(),
  picture: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional()
    .nullable(),
})

export const ContributorsSchema = z.array(ContributorSchema)

export type Contributor = z.infer<typeof ContributorSchema>
export type ContributorRole = z.infer<typeof ContributorRoleSchema>

export const getAllContributors = async (): Promise<Contributor[]> => {
  const contributors =
    await sanityClient.fetch(groq`*[_type == "contributor"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        bio,
        twitterHandle,
        links[]{
          url, label
        },
        picture->{
          "url": asset->url,
            alt
        },
        "slug": slug.current,
  }`)

  return ContributorsSchema.parse(contributors)
}

export const getContributor = async (
  slug: string,
): Promise<Contributor | null> => {
  const contributor = await sanityClient.fetch(
    groq`*[_type == "contributor" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        bio,
        twitterHandle,
        links[]{
          url, label
        },
        picture {
            "url": asset->url,
            alt
        },
        "slug": slug.current,
    }`,
    {slug: `${slug}`},
  )

  const result = ContributorSchema.safeParse(contributor)

  if (result.success) {
    return result.data
  } else {
    // Sentry.captureMessage(`Unable to find Sanity Author with slug '${slug}'`)
    return null
  }
}

// ————————————————————————————————————————————————————————————————————————————————
// CONTRIBUTOR RESOURCES
// ————————————————————————————————————————————————————————————————————————————————

export const ContributorResourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  moduleType: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  muxPlaybackId: z.string().optional().nullable(),
})

export const ContributorResourcesSchema = z.array(ContributorResourceSchema)

export type ContributorResource = z.infer<typeof ContributorResourceSchema>

export const getContributorResources = async (
  id: string,
): Promise<ContributorResource[] | null> => {
  const resources = await sanityClient.fetch(
    groq`*[$id in contributors[].contributor._ref && _type in ["article", "tip", "module", "talk"] && state == 'published'] | order(_createdAt desc) {
            _id,
            _type,
            _updatedAt,
            _createdAt,
            title,
            description,
            summary,
            "slug": slug.current,
            "moduleType": moduleType,
            "image": coalesce(image.asset->url, image.secure_url),
            "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    }`,
    {id},
  )

  const result = ContributorResourcesSchema.safeParse(resources)

  if (result.success) {
    return result.data
  } else {
    return null
  }
}
