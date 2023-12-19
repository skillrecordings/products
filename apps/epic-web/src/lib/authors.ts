import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const AuthorSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string().optional().nullable(),
  picture: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional()
    .nullable(),
})

export const AuthorsSchema = z.array(AuthorSchema)

export type Author = z.infer<typeof AuthorSchema>

export const getAllAuthors = async (): Promise<Author[]> => {
  const authors =
    await sanityClient.fetch(groq`*[_type == "author"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        bio,
        picture->{
            "assets": asset->url,
            alt
        },
        "slug": slug.current,
  }`)

  return AuthorsSchema.parse(authors)
}

export const getAuthor = async (slug: string): Promise<Author | null> => {
  const author = await sanityClient.fetch(
    groq`*[_type == "author" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        bio,
        picture {
            "url": asset->url,
            alt
        },
        "slug": slug.current,
    }`,
    {slug: `${slug}`},
  )

  const result = AuthorSchema.safeParse(author)

  if (result.success) {
    return result.data
  } else {
    // Sentry.captureMessage(`Unable to find Sanity Author with slug '${slug}'`)
    return null
  }
}

// ————————————————————————————————————————————————————————————————————————————————
// AUTHOR RESOURCES
// ————————————————————————————————————————————————————————————————————————————————

export const AuthorResourceSchema = z.object({
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

export const AuthorResourcesSchema = z.array(AuthorResourceSchema)

export type AuthorResource = z.infer<typeof AuthorResourceSchema>

export const getAuthorResources = async (
  id: string,
): Promise<AuthorResource[] | null> => {
  const resources = await sanityClient.fetch(
    groq`*[author->_id == $id && _type in ["article", "tip", "module"] && state == 'published'] | order(_createdAt desc) {
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

  const result = AuthorResourcesSchema.safeParse(resources)

  if (result.success) {
    return result.data
  } else {
    return null
  }
}

export const getKentsResources = async (): Promise<AuthorResource[] | null> => {
  const resources = await sanityClient.fetch(
    groq`*[author == null && _type in ["article", "tip", "module"] && state == 'published'] | order(_createdAt desc) {
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
  )
  const result = AuthorResourcesSchema.safeParse(resources)

  if (result.success) {
    return result.data
  } else {
    return null
  }
}
