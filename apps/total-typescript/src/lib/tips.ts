import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const TipSchema = z.object({
  _id: z.string().optional(),
  _key: z.string().optional(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  description: z.nullable(z.string()).optional(),
  body: z.any().array(),
  resources: z.any().array(),
})

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

export const getAllTips = async (): Promise<Tip[]> => {
  const tips = await sanityClient.fetch(groq`*[_type == "tip"] {
    ...,
    'resources': resources[]{
        _type == 'reference' => @->,
        _type != 'reference' => @,
    }
  }`)

  return TipsSchema.parse(tips)
}

export const getTip = async (slug: string): Promise<Tip> => {
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
      ...,
      'resources': resources[]{
        _type == 'reference' => @->,
        _type != 'reference' => @,
    }
    }`,
    {slug: `${slug}`},
  )

  return TipSchema.parse(tip)
}
