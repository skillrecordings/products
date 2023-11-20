import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const getLessonCodeUrlsQuery = groq`*[_type == "explainer" && _id == $id][0]{
  github_branch_url,
  github_diff_url,
  codesandbox_url
}`

export const getLessonCodeUrls = async ({_id}: {_id: string}) => {
  const response = await sanityClient.fetch(getLessonCodeUrlsQuery, {id: _id})

  return z
    .object({
      github_branch_url: z
        .string()
        .nullish()
        .transform((x) => x ?? undefined),
      github_diff_url: z
        .string()
        .nullish()
        .transform((x) => x ?? undefined),
      codesandbox_url: z
        .string()
        .nullish()
        .transform((x) => x ?? undefined),
    })
    .parse(response)
}
