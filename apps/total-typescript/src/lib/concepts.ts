import {sanityWriteClient} from '@/utils/sanity-server'
import z from 'zod'

export const ConceptSchema = z.object({
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.nullable(z.string().optional()),
})

export type Concept = z.infer<typeof ConceptSchema>

export async function getAllConcepts() {
  const concepts = await sanityWriteClient.fetch(`*[_type == 'concept']`)
  return concepts.map((concept: Concept) => {
    return ConceptSchema.parse({
      ...concept,
    })
  })
}

export async function getConcept(slug?: string) {
  const postContent = await sanityWriteClient.fetch(
    `*[_type == "concept" && slug.current == $slug][0]`,
    {slug},
  )

  const parsedConcept = ConceptSchema.safeParse(postContent)
  return parsedConcept.success ? parsedConcept.data : null
}
