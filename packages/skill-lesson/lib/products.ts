import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import * as mysql from 'mysql2/promise'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

const productsQuery = groq`*[_type == "pricing"][0] {
  title,
  subtitle,
  "products": products[]->{
  "name": title,
  productId,
  description,
  action,
  image {
    url,
    alt
  },
  modules[]->{
    title,
    "image": image.asset->{url, alt},
    state
  },
  features[]{
    value
  }
  }
}`

export const getActiveProducts = async () =>
  (await sanityClient.fetch(productsQuery)) || {
    products: [
      {
        name: 'Pro',
        productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
      },
    ],
  }

export const getProducts = async (productIds: string[]) => {
  // 1. Fetch from Sanity
  const sanityProducts = await sanityClient.fetch(
    groq`*[_type == 'product' && productId in $productIds][]{
    _id,
    productId,
    "modules" : modules[]->{
    _id,
    "features" : features[]{
    value
   },
    "slug": slug.current}
    }`,
    {
      productIds,
    },
  )

  // 2. Fetch from CourseBuilder if configured
  let courseBuilderProducts: any[] = []
  if (process.env.COURSE_BUILDER_DATABASE_URL && productIds.length > 0) {
    let connection: mysql.Connection | null = null
    try {
      connection = await mysql.createConnection(access)

      // Query products from zEW_Product table where id matches productIds
      const placeholders = productIds.map(() => '?').join(', ')
      const [productRows] = await connection.execute(
        `SELECT id, name, fields FROM zEW_Product
         WHERE id IN (${placeholders})
         AND status = 1`,
        productIds,
      )

      if (Array.isArray(productRows) && productRows.length > 0) {
        for (const productRow of productRows as any[]) {
          // Get modules associated with this product
          const [moduleRows] = await connection.execute(
            `SELECT
              resource.id,
              resource.fields
            FROM
              zEW_ContentResourceProduct crp
            JOIN
              zEW_ContentResource resource ON crp.resourceId = resource.id
            WHERE
              crp.productId = ?
              AND crp.deletedAt IS NULL
              AND resource.deletedAt IS NULL`,
            [productRow.id],
          )

          const modules: any[] = []
          if (Array.isArray(moduleRows)) {
            for (const moduleRow of moduleRows as any[]) {
              const moduleFields =
                typeof moduleRow.fields === 'string'
                  ? JSON.parse(moduleRow.fields)
                  : moduleRow.fields || {}

              modules.push({
                _id: moduleRow.id,
                slug: moduleFields.slug || '',
                features: [],
              })
            }
          }

          courseBuilderProducts.push({
            _id: productRow.id,
            productId: productRow.id,
            modules,
          })
        }
      }
    } catch (error) {
      console.error('[getProducts] Error fetching from CourseBuilder:', error)
    } finally {
      if (connection) await connection.end()
    }
  }

  // 3. Merge results
  return [...sanityProducts, ...courseBuilderProducts]
}

export const getAllProducts = async () => {
  const products = await sanityClient.fetch(
    groq`*[_type == 'product'][] | order(_createdAt desc){
    _id,
    _createdAt,
    title,
    description,
    productId,
    state,
    type,
    "slug": slug.current,
    image {
      url,
      alt
    },
    "modules" : modules[]->{
      title,
      moduleType,
      "slug": slug.current,
      "image": image.asset->{url},
      state,
    },
    "bonuses": *[_type == 'bonus'][]{...},
    "features" : features[]{
    value
   }
    }`,
  )
  return products
}

export const getModuleProducts = async (productIds: string[]) => {
  // 1. Fetch from Sanity
  const sanityModules = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && !(null in resources[].productId)] | order(_createdAt desc) {
    _id,
    resources,
    "productId": resources[@._type == 'product'][0].productId,
    }`,
    {
      productIds,
    },
  )
  const sanityProducts = sanityModules.map((product: any) => {
    // product can also be a module with product resource
    // TODO: adjust logic in here: https://github.com/skillrecordings/products/blob/main/packages/skill-lesson/utils/ability.ts#L72
    // so that this object doesn't have to be reshaped
    return {...product, modules: [product]}
  })

  // 2. Fetch from CourseBuilder if configured
  let courseBuilderProducts: any[] = []
  if (process.env.COURSE_BUILDER_DATABASE_URL) {
    let connection: mysql.Connection | null = null
    try {
      connection = await mysql.createConnection(access)

      // Query workshops that have products associated
      const [rows] = await connection.execute(
        `SELECT
          resource.id as module_id,
          resource.fields as module_fields,
          crp.productId
        FROM
          zEW_ContentResourceProduct crp
        JOIN
          zEW_ContentResource resource ON crp.resourceId = resource.id
        WHERE
          resource.type IN ('workshop', 'tutorial')
          AND crp.deletedAt IS NULL
          AND resource.deletedAt IS NULL`,
      )

      if (Array.isArray(rows)) {
        for (const row of rows as any[]) {
          const moduleFields =
            typeof row.module_fields === 'string'
              ? JSON.parse(row.module_fields)
              : row.module_fields || {}

          const moduleData = {
            _id: row.module_id,
            slug: moduleFields.slug || '',
          }

          courseBuilderProducts.push({
            _id: row.module_id,
            productId: row.productId,
            modules: [moduleData],
          })
        }
      }
    } catch (error) {
      console.error(
        '[getModuleProducts] Error fetching from CourseBuilder:',
        error,
      )
    } finally {
      if (connection) await connection.end()
    }
  }

  // 3. Merge results
  return [...sanityProducts, ...courseBuilderProducts]
}

export const getProduct = async (productId: string) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && productId == $productId][0] {
     "name": title,
     slug,
     "image": image.asset->{url, alt},
     state
    }`,
    {
      productId,
    },
  )
  return product
}
