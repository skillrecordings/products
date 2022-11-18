import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

export const tutorialRouter = createRouter().query('bySlug', {
  input: z.object({
    slug: z.string(),
  }),
  async resolve({ctx, input}) {
    return await sanityClient.fetch(
      groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        slug,
        body,
        moduleType,
        _id,
        github,
        ogImage,
        description,
        _updatedAt,
        "exercises": resources[@->._type == 'exercise']->,
        "image": image.asset->url
    }`,
      {slug: input.slug},
    )
  },
})
