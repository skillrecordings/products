import {z} from 'zod'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import * as mysql from 'mysql2/promise'
import slugify from '@sindresorhus/slugify'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const ProductSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  image: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  ogImage: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  productId: z.string().optional(),
  body: z.nullable(z.string()).optional(),
  type: z.enum(['live', 'self-paced']),
  state: z.enum(['draft', 'active', 'published', 'unavailable', 'archived']),
  modules: z.array(z.any()).optional(),
  upgradableTo: z.any(),
  welcomeVideo: z
    .object({
      muxPlaybackId: z.string(),
      poster: z.string().optional().nullable(),
    })
    .nullable(),
})

export const ProductsSchema = z.array(ProductSchema)

export type Product = z.infer<typeof ProductSchema>

// Schema for zEW_Product table (different from zEW_ContentResource)
export const ProductPostSchema = z.object({
  id: z.string(),
  organizationId: z.string().nullish(),
  name: z.string(), // Product name is at top level, not in fields
  key: z.string().nullish(),
  type: z.enum(['live', 'self-paced']).nullish(),
  fields: z
    .object({
      slug: z.string().nullish(),
      state: z
        .enum(['draft', 'active', 'published', 'unavailable', 'archived'])
        .nullish(),
      visibility: z.enum(['public', 'private', 'unlisted']).nullish(),
      description: z.string().nullish(),
      body: z.string().nullish(),
      image: z
        .object({
          url: z.string().nullish(),
          alt: z.string().nullish(),
        })
        .nullish(),
      action: z.string().nullish(),
    })
    .passthrough(),
  createdAt: z.coerce.date().nullish(),
  status: z.number().nullish(),
  quantityAvailable: z.number().nullish(),
})

export type ProductPost = z.infer<typeof ProductPostSchema>

const transformProductPost = async (post: ProductPost): Promise<any> => {
  const transformed = {
    _id: post.id,
    _type: 'product',
    _updatedAt: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
    _createdAt: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
    title: post.name, // Name is at top level in zEW_Product
    slug: post.fields.slug || slugify(post.name),
    description: post.fields.description || null,
    body: post.fields.body || null,
    type: post.type || 'self-paced',
    state: post.fields.state || 'draft',
    image: post.fields.image?.url
      ? {
          url: post.fields.image.url,
          alt: post.fields.image.alt || post.name,
        }
      : undefined,
    ogImage: null,
    productId: post.id, // The product ID is the row id
    action: post.fields.action || null,
    welcomeVideo: null,
    modules: [],
    upgradableTo: null,
  }

  return transformed
}

const fetchProductModules = async (productId: string): Promise<any[]> => {
  const connection = await mysql.createConnection(access)
  try {
    // Use zEW_ContentResourceProduct to link products to workshops
    const [resourceRows] = await connection.execute(
      `
      SELECT
        crp.resourceId,
        crp.position,
        resource.type,
        resource.fields,
        resource.id
      FROM
        zEW_ContentResourceProduct crp
      JOIN
        zEW_ContentResource resource ON crp.resourceId = resource.id
      WHERE
        crp.productId = ?
        AND crp.deletedAt IS NULL
        AND resource.deletedAt IS NULL
      ORDER BY
        crp.position ASC
      `,
      [productId],
    )
    if (!Array.isArray(resourceRows) || resourceRows.length === 0) {
      return []
    }

    const modules = (resourceRows as any[]).map((row) => {
      const fields =
        typeof row.fields === 'string'
          ? JSON.parse(row.fields)
          : row.fields || {}

      return {
        _id: row.id,
        _type: 'module',
        title: fields.title || '',
        slug: fields.slug || slugify(fields.title || ''),
        description: fields.description || '',
        image: fields.coverImage?.url
          ? {
              url: fields.coverImage.url,
              alt: fields.coverImage.alt || fields.title || '',
            }
          : fields.image
          ? {url: fields.image, alt: fields.title || ''}
          : undefined,
        state: fields.state || 'draft',
        moduleType: 'workshop',
      }
    })

    return modules
  } catch (error) {
    console.error('[fetchProductModules] Error:', error)
    return []
  } finally {
    await connection.end()
  }
}

export async function getProduct(productId: string): Promise<Product> {
  // First, try to fetch from CourseBuilder database
  const connection = await mysql.createConnection(access)

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM zEW_ContentResource
       WHERE type = 'product'
       AND JSON_EXTRACT(fields, "$.productId") = ?
       AND deletedAt IS NULL
       LIMIT 1`,
      [productId],
    )

    // Parse JSON fields from database
    const parsedRows = (rows as any[]).map((row) => ({
      ...row,
      fields:
        typeof row.fields === 'string'
          ? JSON.parse(row.fields)
          : row.fields || {},
    }))

    const productPostsParsed = z
      .array(ProductPostSchema.passthrough())
      .safeParse(parsedRows)

    if (productPostsParsed.success && productPostsParsed.data.length > 0) {
      const post = productPostsParsed.data[0]
      const dbProduct = await transformProductPost(post)
      const modules = await fetchProductModules(post.id || '')
      dbProduct.modules = modules
      await connection.end()
      return ProductSchema.parse(dbProduct)
    }
  } catch (error) {
    console.error('[getProduct] Error fetching from CourseBuilder:', error)
  } finally {
    await connection.end()
  }

  // Fall back to Sanity
  const product = await sanityClient.fetch(
    groq`*[_type == "product" && productId == $productId][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        productId,
        title,
        description,
        type,
        image,
        action,
        ogImage,
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
          "instructors": contributors[@.role == 'instructor'].contributor->{
              ...,
              picture {
                "url": asset->url,
                alt
              }, 
              "slug": slug.current,
          },
        }
  }`,
    {productId},
  )

  return ProductSchema.parse(product)
}

export async function getAllProducts(onlyActive = true) {
  // 1. Fetch from CourseBuilder
  let transformedProductPosts: any[] = []
  try {
    const connection = await mysql.createConnection(access)

    // Query the correct table: zEW_Product
    const [rows] = await connection.execute(
      `SELECT * FROM zEW_Product WHERE status = 1 ORDER BY createdAt DESC`,
    )

    // Parse JSON fields from database
    const parsedRows = (rows as any[]).map((row) => ({
      ...row,
      fields:
        typeof row.fields === 'string'
          ? JSON.parse(row.fields)
          : row.fields || {},
    }))

    // Parse and transform
    const parseResult = z
      .array(ProductPostSchema.passthrough())
      .safeParse(parsedRows)
    const productPosts = parseResult.success ? parseResult.data : []

    transformedProductPosts = await Promise.all(
      productPosts.map(async (post) => {
        const dbProduct = await transformProductPost(post)
        const modules = await fetchProductModules(post.id || '')
        dbProduct.modules = modules
        return dbProduct
      }),
    )
    await connection.end()
  } catch (error) {
    console.error('[getAllProducts] Error fetching from CourseBuilder:', error)
    // Continue with Sanity-only results
  }

  // 2. Fetch from Sanity
  const sanityProducts = await sanityClient.fetch(
    groq`*[_type == "product" && state == $state] | order(_createdAt desc) {
      _id,
      _type,
      _updatedAt,
      _createdAt,
      productId,
      title,
      description,
      type,
      image,
      ogImage,
      action,
      state,
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
    }`,
    {state: onlyActive ? 'active' : undefined},
  )

  // 3. Merge and sort
  let allProducts = [...sanityProducts, ...transformedProductPosts]
  if (onlyActive) {
    // Accept 'active' or 'published' as active states
    allProducts = allProducts.filter(
      (p: any) => p.state === 'active' || p.state === 'published',
    )
  }
  allProducts.sort(
    (a: any, b: any) =>
      new Date(b._createdAt || '').getTime() -
      new Date(a._createdAt || '').getTime(),
  )
  return allProducts
}
