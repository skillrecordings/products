import * as React from 'react'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {Purchase} from '@prisma/client'
import {getSdk} from 'lib/prisma-api'
import Layout from 'components/app/layout'
import last from 'lodash/last'
import get from 'lodash/get'
import Link from 'next/link'
import groq from 'groq'

const productQuery = groq`*[_type == "product" && productId == $productId][0]{
  title,
  productId,
  modules[]->{
    title,
    "slug": slug.current,
    sections[]->{
      title,
      "slug": slug.current,
      lessons[]->{
        title,
        "slug": slug.current
      }
    }
  }
  }`

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const sessionToken = await getDecodedToken(req)

  if (sessionToken && sessionToken.sub) {
    const {getPurchasesForUser} = getSdk()
    const purchases = await getPurchasesForUser(sessionToken.sub)

    // TODO: make sure we always get the highest ranking tier
    const productId = purchases && get(last(purchases), 'productId')

    // fetch product from sanity based on user's productId associated with their purchase
    const product = await sanityClient.fetch(productQuery, {
      productId,
    })
    return {
      props: {
        product,
        purchases,
      },
    }
  }

  return {
    props: {},
  }
}

const Learn: React.FC<{purchases: Purchase[]; product: SanityDocument}> = ({
  purchases,
  product,
}) => {
  const {title, modules} = product
  return (
    <Layout className="p-5">
      <h1 className="font-bold text-lg">{title}</h1>
      {modules.map((module: SanityDocument) => (
        <ol className="list-decimal px-5" key={module.slug}>
          <li>
            <Link
              href={{pathname: '/learn/[module]', query: {module: module.slug}}}
              passHref
            >
              <a className="underline">{module.title}</a>
            </Link>
          </li>
          {module.sections && (
            <ol className="list-decimal px-5">
              {module.sections.map((section: SanityDocument) => (
                <div key={section.slug}>
                  <li>
                    <Link
                      href={{
                        pathname: '/learn/[module]/[section]',
                        query: {module: module.slug, section: section.slug},
                      }}
                      passHref
                    >
                      <a className="underline">{section.title}</a>
                    </Link>
                  </li>
                  {section.lessons && (
                    <ol className="list-decimal px-5">
                      {section.lessons.map((lesson: SanityDocument) => (
                        <li key={lesson.slug}>
                          <Link
                            href={{
                              pathname: '/learn/[module]/[section]/[lesson]',
                              query: {
                                module: module.slug,
                                section: section.slug,
                                lesson: lesson.slug,
                              },
                            }}
                            passHref
                          >
                            <a className="underline">{lesson.title}</a>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </ol>
          )}
        </ol>
      ))}
    </Layout>
  )
}

export default Learn
