import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {ContributorSchema} from './contributors'

export const EventSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  host: ContributorSchema.nullable(),
  description: z.nullable(z.string()).optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['published', 'draft']),
  timezone: z.nullable(z.string().url()).optional(),
  events: z
    .array(
      z.object({
        title: z.string(),
        startsAt: z.string(),
        endsAt: z.string(),
      }),
    )
    .nullable()
    .optional(),
  image: z
    .object({
      width: z.number(),
      height: z.number(),
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  ogImage: z
    .object({
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  product: z
    .object({
      _id: z.string(),
      slug: z.string(),
      title: z.string(),
      productId: z.string(),
    })
    .nullable(),
})

export const EventsSchema = z.array(EventSchema)

export type Event = z.infer<typeof EventSchema>

export const getAllEvents = async (onlyPublished = true): Promise<Event[]> => {
  const events = await sanityClient.fetch(groq`*[_type == "event" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        "host": contributors[@.role == 'host'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        title,
        state,
        "slug": slug.current,
        startsAt,
        endsAt,
        description,
        timezone,
        body,
        image,
        ogImage,
        events[]{...},
        "product": *[_type in ['product'] && references(^._id)][0]{
          _id,
          productId,
          "slug": slug.current,
          title
        }
  }`)

  return EventsSchema.parse(events)
}

export const getEvent = async (slug: string): Promise<Event | null> => {
  const event = await sanityClient.fetch(
    groq`*[_type == "event" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        events[]{...},
        "host": contributors[@.role == 'host'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        title,
        state,
        "slug": slug.current,
        startsAt,
        endsAt,
        description,
        timezone,
        body,
        image,
        ogImage,
        "product": *[_type in ['product'] && references(^._id)][0]{
          _id,
          productId,
          "slug": slug.current,
          title
        },
        
    }`,
    {slug: `${slug}`},
  )

  return EventSchema.nullable().parse(event)
}
