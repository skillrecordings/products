import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import * as mysql from 'mysql2/promise'
import {prisma} from '@skillrecordings/database'
import type {Contributor} from './contributors'
import {ContributorSchema} from './contributors'
import {ProductSchema, fetchProductModules} from './products'
import slugify from '@sindresorhus/slugify'
import type {Section} from '@skillrecordings/skill-lesson/schemas/section'
import type {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'

// CourseBuilder Database Row Schemas
const CBContentResourceRowSchema = z.object({
  id: z.string(),
  type: z.string(),
  fields: z.union([z.string(), z.record(z.unknown())]),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  organizationId: z.string().nullable(),
  createdById: z.string().nullable(),
  createdByOrganizationMembershipId: z.string().nullable(),
  currentVersionId: z.string().nullable(),
})
type CBContentResourceRow = z.infer<typeof CBContentResourceRowSchema>

const CBResourceRowSchema = CBContentResourceRowSchema.extend({
  resourceId: z.string(),
  position: z.number(),
})
type CBResourceRow = z.infer<typeof CBResourceRowSchema>

const CBProductRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.number(),
  fields: z.union([z.string(), z.record(z.unknown())]),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})
type CBProductRow = z.infer<typeof CBProductRowSchema>

const CBUserRowSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  avatar_url: z.string().nullable(),
  avatarUrl: z.string().nullable(),
})
type CBUserRow = z.infer<typeof CBUserRowSchema>

const CBOrganizationMembershipRowSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
})
type CBOrganizationMembershipRow = z.infer<
  typeof CBOrganizationMembershipRowSchema
>

// Transformed Product Schema for workshops
const WorkshopProductSchema = z.object({
  _id: z.string(),
  name: z.string(),
  title: z.string(),
  slug: z.string(),
  productId: z.string(),
  state: z.string(),
  description: z.string().nullable(),
  action: z.string().nullable(),
  image: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .nullable(),
  modules: z.array(z.unknown()),
  upgradableTo: z.unknown().nullable(),
})
type WorkshopProduct = z.infer<typeof WorkshopProductSchema>

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

const buildContributor = ({
  id,
  name,
  image,
}: {
  id: string
  name: string | null
  image: string | null
}): Contributor => {
  return {
    _id: id,
    _type: 'contributor',
    _updatedAt: new Date().toISOString(),
    _createdAt: new Date().toISOString(),
    name: name || 'Unknown',
    slug: slugify(name || 'unknown'),
    bio: null,
    links: null,
    picture: image
      ? {
          url: image,
          alt: name || 'Contributor',
        }
      : null,
  }
}

const fetchContributorFromSanityByUserId = async (
  userId: string,
): Promise<Contributor | null> => {
  try {
    const contributor = await sanityClient.fetch(
      groq`*[_type == "contributor" && userId == $userId][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        "slug": slug.current,
        bio,
        links[] {
          url, label
        },
        picture {
          "url": asset->url,
          alt
        }
      }`,
      {userId},
    )
    if (contributor && contributor._id) {
      return ContributorSchema.parse(contributor)
    }
  } catch (err) {
    console.error('Error fetching contributor from Sanity', err)
  }
  return null
}

const WorkshopSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  moduleType: z.enum(['workshop', 'bonus']),
  state: z.enum(['draft', 'published']),
  image: z.nullable(z.string()).optional(),
  ogImage: z.nullable(z.string()).optional(),
  lessonCount: z.number().optional().nullable(),
  workshopApp: z
    .nullable(
      z.object({
        path: z.string().nullable().optional(),
        localhost: z
          .object({
            path: z.string().optional(),
          })
          .optional(),
        external: z.object({
          url: z.string().optional(),
        }),
      }),
    )
    .optional(),
  github: z
    .nullable(
      z.object({
        repo: z.string(),
        title: z.string().nullable(),
      }),
    )
    .optional(),
  instructor: ContributorSchema.optional().nullable(),
  product: z.array(ProductSchema).optional().nullable(),
  lessons: z.array(z.any()).optional().nullable(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        _updatedAt: z.string().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        slug: z.string(),
        lessons: z.array(
          z.object({
            _id: z.string(),
            _type: z.string(),
            _updatedAt: z.string().optional(),
            title: z.string(),
            description: z.string().optional().nullable(),
            slug: z.string(),
            solution: z
              .nullable(
                z.object({
                  _key: z.string(),
                  _type: z.string(),
                  _updatedAt: z.string().optional(),
                  title: z.string(),
                  description: z.string().optional().nullable(),
                  slug: z.string(),
                }),
              )
              .optional(),
          }),
        ),
        resources: z.any(),
      }),
    )
    .optional()
    .nullable(),
})
export const WorkshopsSchema = z.array(WorkshopSchema)
export type Workshop = z.infer<typeof WorkshopSchema>

export const WorkshopPostSchema = z.object({
  id: z.string().nullish(),
  organizationId: z.string().nullish(),
  createdByOrganizationMembershipId: z.string().nullish(),
  type: z.string().nullish(),
  createdById: z.string().nullish(),
  fields: z.object({
    body: z.string().nullish(),
    slug: z.string().nullish(),
    state: z.enum(['draft', 'published']).nullish(),
    title: z.string().nullish(),
    github: z.string().nullish(),
    visibility: z.string().nullish(),
    description: z.string().nullish(),
    moduleType: z.string().nullish(),
    workshopApp: z.any().nullish(),
    coverImage: z
      .object({
        url: z.string().nullish(),
        alt: z.string().nullish(),
      })
      .nullish(),
    image: z.string().nullish(),
    ogImage: z.string().nullish(),
  }),
  currentVersionId: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export type WorkshopPost = z.infer<typeof WorkshopPostSchema>

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop' && state == 'published'] | order(_createdAt desc) {
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
  github,
  workshopApp,
  "lessonCount": count(resources[@->._type in ['lesson', 'exercise', 'explainer']] + resources[@->._type == 'section']->resources[@->._type in ['lesson', 'exercise', 'explainer']]),
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
    _id,
    _type,
    _updatedAt,
    _createdAt,
    productId,
    title,
    description,
    type,
    image,
    state,
    type,
    "slug": slug.current,
    body,
    "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
    upgradableTo[]->{
      ...,
      modules[]->{
        ...,
        "description": "",
        "image": image.asset->{url},
      }  
    },
    modules[]->{
      ...,
      "image": image.asset->{url},
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

const fullStackVol1WorkshopsQuery = groq`*[_type == "product" && slug.current == 'full-stack-vol-1'][0] {
  modules[]->{
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
      _id,
      _type,
      _updatedAt,
      _createdAt,
      productId,
      title,
      description,
      type,
      image,
      state,
      type,
      "slug": slug.current,
      body,
      "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
      upgradableTo[]->{
        ...,
        modules[]->{
          ...,
          "description": "",
          "image": image.asset->{url},
        }  
      },
      modules[]->{
        ...,
        "image": image.asset->{url},
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
  }
}`

const fetchWorkshopProduct = async (
  workshopId: string,
): Promise<WorkshopProduct | null> => {
  const connection = await mysql.createConnection(access)
  try {
    // Find product that contains this workshop via zEW_ContentResourceProduct
    const [productRows] = await connection.execute(
      `
      SELECT p.*
      FROM zEW_ContentResourceProduct crp
      JOIN zEW_Product p ON crp.productId = p.id
      WHERE crp.resourceId = ?
        AND crp.deletedAt IS NULL
        AND p.status = 1
      ORDER BY p.createdAt DESC
      LIMIT 1
      `,
      [workshopId],
    )

    if (!Array.isArray(productRows) || productRows.length === 0) {
      return null
    }

    const productRow = productRows[0] as CBProductRow
    const fields =
      typeof productRow.fields === 'string'
        ? (JSON.parse(productRow.fields) as Record<string, unknown>)
        : (productRow.fields as Record<string, unknown>) || {}

    // Transform to match expected product structure
    const imageField = fields.image as {url?: string} | undefined

    // Fetch the modules (workshops) linked to this product
    const modules = await fetchProductModules(productRow.id)

    const product: WorkshopProduct = {
      _id: productRow.id,
      name: productRow.name,
      title: productRow.name,
      slug: (fields.slug as string) || slugify(productRow.name),
      productId: productRow.id,
      state: (fields.state as string) || 'draft',
      description: (fields.description as string) || null,
      action: (fields.action as string) || null,
      image: imageField?.url
        ? {url: imageField.url, alt: productRow.name}
        : null,
      modules: modules,
      upgradableTo: null,
    }

    return product
  } catch (error) {
    console.error('[fetchWorkshopProduct] Error:', error)
    return null
  } finally {
    await connection.end()
  }
}

// Transformed Workshop Schema (returned from transformWorkshopPost)
const TransformedWorkshopSchema = z.object({
  id: z.string(),
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.object({current: z.string()}),
  description: z.string().nullable(),
  body: z.string().nullable(),
  moduleType: z.string(),
  state: z.string(),
  image: z.string().nullable(),
  ogImage: z.string().nullable(),
  workshopApp: z
    .object({
      path: z.string().nullable().optional(),
      localhost: z.object({path: z.string().optional()}).optional(),
      external: z.object({url: z.string().optional()}).optional(),
    })
    .nullable()
    .optional(),
  github: z
    .object({
      repo: z.string(),
      title: z.null(),
    })
    .nullable(),
  instructor: ContributorSchema.nullable(),
  sections: z.array(z.custom<Section>()),
  product: WorkshopProductSchema.nullable(),
})
type TransformedWorkshop = z.infer<typeof TransformedWorkshopSchema>

const transformWorkshopPost = async (
  post: WorkshopPost,
  sections: Section[] = [],
  product: WorkshopProduct | null = null,
): Promise<TransformedWorkshop> => {
  let instructor: Contributor | null = null

  if (post.createdById) {
    instructor = await fetchContributorFromSanityByUserId(post.createdById)
  }

  if (!instructor && post.createdById) {
    const connection = await mysql.createConnection(access)
    try {
      let cbUser: CBUserRow | null = null
      const [userRows] = await connection.execute(
        'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
        [post.createdById],
      )
      if (Array.isArray(userRows) && userRows.length > 0) {
        cbUser = userRows[0] as CBUserRow
      }

      if (!cbUser && post.createdByOrganizationMembershipId) {
        const [membershipRows] = await connection.execute(
          `SELECT userId FROM zEW_OrganizationMembership WHERE id = ? LIMIT 1`,
          [post.createdByOrganizationMembershipId],
        )
        if (Array.isArray(membershipRows) && membershipRows.length > 0) {
          const membership = membershipRows[0] as CBOrganizationMembershipRow
          if (membership.userId) {
            const [userRows] = await connection.execute(
              'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
              [membership.userId],
            )
            if (Array.isArray(userRows) && userRows.length > 0) {
              cbUser = userRows[0] as CBUserRow
            }
          }
        }
      }

      if (cbUser) {
        let productUser = null
        if (cbUser.email) {
          productUser = await prisma.user.findUnique({
            where: {email: cbUser.email as string},
          })
        }

        if (productUser?.id) {
          instructor = await fetchContributorFromSanityByUserId(productUser.id)
        }

        if (!instructor) {
          instructor = buildContributor({
            id: productUser?.id || cbUser.id,
            name: productUser?.name || cbUser.name || cbUser.fullName || null,
            image:
              productUser?.image ||
              cbUser.avatar_url ||
              cbUser.avatarUrl ||
              null,
          })
        }
      }
      await connection.end()
    } catch (error) {
      console.error('Error fetching instructor for workshop', error)
      if (connection) await connection.end()
    }
  }

  const transformed = {
    id: post.id || '',
    _id: post.id || '',
    _type: 'module',
    _updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : '',
    _createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : '',
    title: post.fields.title || '',
    slug: {
      current: post.fields.slug || '',
    },
    description: post.fields.description || null,
    body: post.fields.body || null,
    moduleType: 'workshop',
    state:
      post.fields.state ||
      (post.fields.visibility === 'public' ? 'published' : 'draft'),
    image: post.fields.coverImage?.url || post.fields.image || null,
    ogImage: post.fields.ogImage || null,
    workshopApp: post.fields.workshopApp || null,
    github: post.fields.github
      ? {
          repo: post.fields.github,
          title: null,
        }
      : null,
    instructor,
    sections: sections || [],
    product: product,
  }

  return transformed
}

const fetchWorkshopSections = async (
  workshopId: string,
): Promise<Section[]> => {
  const connection = await mysql.createConnection(access)
  try {
    const [allResourceRows] = await connection.execute(
      `
      SELECT
        crr.resourceId,
        crr.position,
        resource.type,
        resource.fields,
        resource.id,
        resource.createdAt,
        resource.updatedAt
      FROM
        zEW_ContentResourceResource crr
      JOIN
        zEW_ContentResource resource ON crr.resourceId = resource.id
      WHERE
        crr.resourceOfId = ?
        AND crr.deletedAt IS NULL
        AND resource.deletedAt IS NULL
      ORDER BY
        crr.position ASC
      `,
      [workshopId],
    )

    if (!Array.isArray(allResourceRows) || allResourceRows.length === 0) {
      return []
    }

    const sectionRows: CBResourceRow[] = []
    const directLessonRows: CBResourceRow[] = []

    for (const row of allResourceRows as CBResourceRow[]) {
      const fields =
        typeof row.fields === 'string'
          ? (JSON.parse(row.fields) as Record<string, unknown>)
          : (row.fields as Record<string, unknown>) || {}
      const resourceType = row.type || ''

      if (
        resourceType === 'section' ||
        fields.sectionType ||
        fields.resourceType === 'section'
      ) {
        sectionRows.push(row)
      } else if (
        resourceType === 'lesson' ||
        resourceType === 'exercise' ||
        resourceType === 'explainer' ||
        resourceType === 'post' || // Posts are treated as lessons
        fields.lessonType ||
        fields.resourceType === 'lesson'
      ) {
        directLessonRows.push(row)
      } else {
        console.error(
          '[fetchWorkshopSections] Unknown resource type:',
          resourceType,
          'for',
          row.id,
        )
      }
    }

    const sections: Section[] = []

    if (sectionRows.length > 0) {
      for (const sectionRow of sectionRows) {
        const sectionFields =
          typeof sectionRow.fields === 'string'
            ? (JSON.parse(sectionRow.fields) as Record<string, unknown>)
            : (sectionRow.fields as Record<string, unknown>) || {}

        const sectionSlug =
          (sectionFields.slug as string) ||
          slugify((sectionFields.title as string) || '')
        const section: Section = {
          _id: sectionRow.id,
          _type: 'section',
          _updatedAt: sectionRow.updatedAt
            ? new Date(sectionRow.updatedAt).toISOString()
            : new Date().toISOString(),
          title: (sectionFields.title as string) || '',
          description: (sectionFields.description as string) || null,
          slug: sectionSlug,
          lessons: [] as Lesson[],
          resources: [],
        }

        const [sectionResourceRows] = await connection.execute(
          `
          SELECT
            crr.resourceId,
            crr.position,
            resource.type,
            resource.fields,
            resource.id,
            resource.createdAt,
            resource.updatedAt
          FROM
            zEW_ContentResourceResource crr
          JOIN
            zEW_ContentResource resource ON crr.resourceId = resource.id
          WHERE
            crr.resourceOfId = ?
            AND crr.deletedAt IS NULL
            AND resource.deletedAt IS NULL
          ORDER BY
            crr.position ASC
          `,
          [sectionRow.id],
        )

        if (Array.isArray(sectionResourceRows)) {
          for (const resourceRow of sectionResourceRows as CBResourceRow[]) {
            const resourceFields =
              typeof resourceRow.fields === 'string'
                ? (JSON.parse(resourceRow.fields) as Record<string, unknown>)
                : (resourceRow.fields as Record<string, unknown>) || {}
            const resourceType = resourceRow.type || ''

            if (
              resourceType === 'lesson' ||
              resourceType === 'exercise' ||
              resourceType === 'explainer' ||
              resourceType === 'post' || // Posts are treated as lessons
              resourceFields.lessonType ||
              resourceFields.resourceType === 'lesson'
            ) {
              const lessonSlug =
                (resourceFields.slug as string) ||
                slugify((resourceFields.title as string) || '')
              const lesson: Lesson = {
                _id: resourceRow.id,
                _type:
                  resourceType === 'post' ? 'lesson' : resourceType || 'lesson',
                _updatedAt: resourceRow.updatedAt
                  ? new Date(resourceRow.updatedAt).toISOString()
                  : new Date().toISOString(),
                title: (resourceFields.title as string) || '',
                description: (resourceFields.description as string) || null,
                slug: lessonSlug,
              }
              if (section.lessons) {
                section.lessons.push(lesson)
              }
            }
          }
        }

        sections.push(section)
      }
    }

    if (directLessonRows.length > 0 && sections.length === 0) {
      const defaultSection: Section = {
        _id: `${workshopId}-default-section`,
        _type: 'section',
        _updatedAt: new Date().toISOString(),
        title: 'Lessons',
        description: null,
        slug: 'lessons',
        lessons: [] as Lesson[],
        resources: [],
      }

      for (const lessonRow of directLessonRows) {
        const lessonFields =
          typeof lessonRow.fields === 'string'
            ? (JSON.parse(lessonRow.fields) as Record<string, unknown>)
            : (lessonRow.fields as Record<string, unknown>) || {}

        const lessonSlug =
          (lessonFields.slug as string) ||
          slugify((lessonFields.title as string) || '')
        const lesson: Lesson = {
          _id: lessonRow.id,
          _type:
            lessonRow.type === 'post' ? 'lesson' : lessonRow.type || 'lesson',
          _updatedAt: lessonRow.updatedAt
            ? new Date(lessonRow.updatedAt).toISOString()
            : new Date().toISOString(),
          title: (lessonFields.title as string) || '',
          description: (lessonFields.description as string) || null,
          slug: lessonSlug,
        }
        if (defaultSection.lessons) {
          defaultSection.lessons.push(lesson)
        }
      }

      sections.push(defaultSection)
    }

    return sections
  } catch (error) {
    console.error(
      '[fetchWorkshopSections] Error fetching workshop sections for',
      workshopId,
      ':',
      error,
    )
    return []
  } finally {
    await connection.end()
  }
}

export const getAllWorkshops = async (onlyPublished = true) => {
  // 1. Fetch from CourseBuilder
  const connection = await mysql.createConnection(access)
  const query = `SELECT * FROM zEW_ContentResource
     WHERE type = 'workshop'
     ${
       onlyPublished
         ? `AND (JSON_EXTRACT(fields, "$.state") = 'published' OR JSON_EXTRACT(fields, "$.visibility") = 'public')`
         : ''
     }
     AND deletedAt IS NULL
     ORDER BY createdAt DESC`
  const [rows] = await connection.execute(query)

  // Parse and transform
  const workshopPosts = z.array(WorkshopPostSchema.passthrough()).parse(rows)
  const transformedWorkshopPosts = await Promise.all(
    workshopPosts.map(async (post) => {
      const sections = await fetchWorkshopSections(post.id || '')
      const product = await fetchWorkshopProduct(post.id || '')
      return await transformWorkshopPost(post, sections, product)
    }),
  )
  await connection.end()

  // 2. Fetch from Sanity (existing code)
  const sanityWorkshops = await sanityClient.fetch(workshopsQuery)

  // 3. Merge and sort
  type WorkshopItem = {
    slug: {current: string}
    state?: string
    _createdAt?: string
  }
  let allWorkshops: WorkshopItem[] = [
    ...sanityWorkshops,
    ...transformedWorkshopPosts,
  ]
  if (onlyPublished) {
    allWorkshops = allWorkshops.filter(
      (w: WorkshopItem) => w.state === 'published',
    )
  }
  allWorkshops.sort(
    (a: WorkshopItem, b: WorkshopItem) =>
      new Date(b._createdAt || '').getTime() -
      new Date(a._createdAt || '').getTime(),
  )
  return allWorkshops
}

export const getFullStackVol1Workshops = async () => {
  const product = await sanityClient.fetch(fullStackVol1WorkshopsQuery)
  const workshops = product.modules
  const parsedWorkshops = WorkshopsSchema.safeParse(workshops)

  if (!parsedWorkshops.success) {
    console.error('Error parsing workshops')
    console.error(parsedWorkshops.error)
    return []
  } else {
    return parsedWorkshops.data
  }
}

export const getWorkshop = async (slug: string) => {
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    `SELECT * FROM zEW_ContentResource
     WHERE type = 'workshop'
     AND JSON_EXTRACT(fields, "$.slug") = ?
     AND deletedAt IS NULL`,
    [slug],
  )

  const workshopPostsParsed = z
    .array(WorkshopPostSchema.passthrough())
    .safeParse(rows)

  if (workshopPostsParsed.success && workshopPostsParsed.data.length > 0) {
    const post = workshopPostsParsed.data[0]
    const sections = await fetchWorkshopSections(post.id || '')
    const product = await fetchWorkshopProduct(post.id || '')
    const dbWorkshop = await transformWorkshopPost(post, sections, product)
    await connection.end()
    return dbWorkshop
  } else {
    const errorMessage = !workshopPostsParsed.success
      ? workshopPostsParsed.error
      : 'none'
    console.error(
      '[getWorkshop] Failed to parse or no workshop found in database, error:',
      errorMessage,
    )
    await connection.end()
  }

  return await sanityClient.fetch(
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
        'product': *[_type == 'product' && references(^._id)] | order(count(modules) asc)[0]{
          _id,
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
            "name": title,
            productId,
            "slug": slug.current,
            modules[]->{
            ...,
            "description": "",
            "image": image.asset->{url},
          }
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
}
