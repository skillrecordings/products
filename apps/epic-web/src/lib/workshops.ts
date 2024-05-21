import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import {ContributorSchema} from './contributors'

const SlugSchema = z.object({current: z.string()})

const LinkResourceSchema = z.object({
  url: z.string(),
  label: z.string().optional(),
})

const ImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
})

const ModuleSchema = z.object({
  slug: z.string(),
  moduleType: z.string(),
  title: z.string(),
  image: ImageSchema.optional(),
  state: z.string(),
})

const EpicWebProductSchema = z.object({
  modules: z.array(ModuleSchema),
})

const LessonSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  slug: SlugSchema,
  solution: z
    .object({
      _key: z.string(),
      _type: z.string(),
      _updatedAt: z.string(),
      title: z.string(),
      description: z.string(),
      slug: z.string(),
    })
    .optional(),
})

const SectionSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  slug: SlugSchema,
  lessons: z.array(LessonSchema),
  resources: z.array(LinkResourceSchema),
})

const WorkshopSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string(),
  slug: z.object({current: z.string()}),
  moduleType: z.string(),
  image: ImageSchema.shape.url,
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  state: z.string(),
  instructor: ContributorSchema,
  product: EpicWebProductSchema,
  sections: z.array(SectionSchema),
})

export type Workshop = z.infer<typeof WorkshopSchema>

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop' && state == 'published'] | order(_createdAt asc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  "instructor": contributors[@.role == 'instructor'][0].contributor->{
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
  'product': *[_type=='product' && references(^._id)][]{
    "slug": slug.current,
    state,
    productId,
    description,
    action,
    image {
      url,
      alt
    },
    modules[]->{
      "slug": slug.current,
      moduleType,
      title,
      "image": image.asset->{url, alt},
      state,
    },
    features[]{
      value
    }
  },
  "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer']]->{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        "slug": slug.current,
      }
    },
    "resources": resources[@->._type in ['linkResource']]->
  }
}`

export const getAllWorkshops = async () =>
  await sanityClient.fetch(workshopsQuery)

export const getWorkshop = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
        body,
        moduleType,
        _id,
        github,
        workshopApp,
        ogImage,
        description,
        _updatedAt,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
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
        "testimonials": resources[@->._type == 'testimonial']->{
          _id,
          _type,
          _updatedAt,
          body,
          author {
            name,
            "image": image.asset->url
          }
        },
        "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            workshopApp,
            "slug": slug.current,
            "solution": resources[@._type == 'solution'][0]{
              _key,
              _type,
              "_updatedAt": ^._updatedAt,
              title,
              description,
              "slug": slug.current,
            }
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "image": image.asset->url, 
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
        'product': *[_type == 'product' && references(^._id) && state == 'active'] | order(count(modules) asc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          state,
          description,
          action,
          image,
          unitAmount,
          upgradableTo[0]->{
            ...,
            productId,
            "slug": slug.current,
            modules[]->{moduleType},
          },
          modules[]->{
            "slug": slug.current,
            moduleType,
            title,
            "image": image.asset->{url, alt},
            state,
          },
          features[]{
            value,
            icon
          }
        },
    }`,
    {slug: `${slug}`},
  )
