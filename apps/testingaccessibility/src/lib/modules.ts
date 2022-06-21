import {getPurchasedProduct} from 'server/get-purchased-product'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {NextApiRequest} from 'next'
import flatten from 'lodash/flatten'
import groq from 'groq'

export async function getAvailableModulesForUser(req: NextApiRequest | any) {
  const {product} = await getPurchasedProduct(req)
  const modules: {slug: string}[] = flatten(
    product.modules.map((module: SanityDocument) => module),
  )
  return modules
}

export async function getAllModuleSlugs() {
  return await sanityClient.fetch(groq`*[_type == "module"]{
    "slug": slug.current
}`)
}

export async function getModule(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        body,
        image{
              url,
              alt
            },
        sections[]->{
            title,
            "slug": slug.current,
            body[]{
            ...,
            markDefs[]{
              ...,
            _type == "internalLink" => {
              "_id": @.reference->_id,
              "slug": @.reference->slug,
              "type": @.reference->_type,
              "modules": *[_type=='module']{
                "slug": slug.current,
                sections[]->{
                  "slug": slug.current,
                  lessons[]->{
                    "slug": slug.current,
                  }
                }
              }
            }
          }
            },
            image{
              url,
              alt
            },
            lessons[]->{
              title,
              "slug": slug.current
            }
          }
        }`,
    {
      slug,
    },
  )
}
