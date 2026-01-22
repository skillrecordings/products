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
  resources: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        moduleType: z.string(),
        title: z.string(),
        description: z.string(),
        slug: z.string(),
      }),
    )
    .nullable()
    .optional(),
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
  products: z
    .array(
      z.object({
        _id: z.string(),
        slug: z.string(),
        title: z.string(),
        productId: z.string(),
        type: z.enum(['live', 'self-paced']).optional(),
        isBundle: z.boolean().optional(),
      }),
    )
    .nullable()
    .optional(),
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
        },
        "products": *[_type == "product" && references(^._id)]{
          _id,
          productId,
          "slug": slug.current,
          title,
          type,
          "isBundle": count(modules[@->._type == "event"]) > 1
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
        "resources": resources[]->{
          _id,
          _type,
          moduleType,
          title,
          description,
          "slug": slug.current,
        },
        startsAt,
        endsAt,
        description,
        timezone,
        body,
        image,
        ogImage,
        "product": *[_type == "product" && ^._id in modules[]->_id][0]{
          _id,
          productId,
          "slug": slug.current,
          title
        },
        "products": *[_type == "product" && references(^._id)]{
          _id,
          productId,
          "slug": slug.current,
          title,
          type,
          "isBundle": count(modules[@->._type == "event"]) > 1
        }
    }`,
    {slug: `${slug}`},
  )

  return EventSchema.nullable().parse(event)
}

export const EventConfSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
})

export const EventsConfSchema = z.array(EventConfSchema)

export type EventConf = z.infer<typeof EventConfSchema>

export const getEventConf = async (
  slug: string = 'conf',
): Promise<EventConf | null> => {
  const eventConf = await sanityClient.fetch(
    groq`*[_type == "event" && slug.current == "conf/2024"][0] {
        _id,
        _type,
        title,
        "slug": slug.current,
        description,
    }`,
    {slug: `${slug}`},
  )

  return EventConfSchema.parse(eventConf)
}
