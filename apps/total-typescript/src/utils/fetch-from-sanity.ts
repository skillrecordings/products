import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

export const fetchFromSanity = async <T>(
  schema: z.Schema<T>,
  query: string,
  variables?: any,
) => {
  const result = await sanityClient.fetch(query, variables)
  return schema.parse(result)
}
