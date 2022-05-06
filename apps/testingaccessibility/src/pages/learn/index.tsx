import * as React from 'react'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {serialize} from 'utils/prisma-next-serializer'
import {PortableText} from '@portabletext/react'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {Purchase} from '@prisma/client'
import {getSdk} from 'lib/prisma-api'
import PortableTextComponents from 'components/portable-text'
import Search from 'components/search/autocomplete'
import Layout from 'components/app/layout'
import last from 'lodash/last'
import get from 'lodash/get'
import Link from 'next/link'
import cx from 'classnames'
import groq from 'groq'
import Image from 'next/image'

const productQuery = groq`*[_type == "product" && productId == $productId][0]{
  title,
  productId,
  modules[]->{
    title,
    "slug": slug.current,
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
        purchases: purchases.map(serialize),
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
    <Layout>
      <header className="w-full bg-gray-100">
        <div className="mx-auto py-[2px] w-full max-w-screen-lg">
          <Search product={product} />
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto w-full p-5 pt-16">
        <h1 className="text-center uppercase text-xs leading-none font-bold text-pink-700">
          {title}
        </h1>
        {modules.map((module: SanityDocument) => (
          <ol className="" key={module.slug}>
            <li className="w-full text-center pb-8">
              <Link
                href={{
                  pathname: '/learn/[module]',
                  query: {module: module.slug},
                }}
                passHref
              >
                <a className="hover:underline text-2xl font-medium pt-2 inline-flex">
                  {module.title}
                </a>
              </Link>
            </li>
            {module.sections && (
              <li className="list-none">
                <Sections module={module} />
              </li>
            )}
          </ol>
        ))}
      </main>
    </Layout>
  )
}

export const Sections: React.FC<any> = ({module}) => {
  return (
    <ol className="pt-16">
      {module.sections.map((section: SanityDocument, i: number) => {
        const isIntroSection = i === 0

        return (
          <li
            key={section.slug}
            className={cx(
              'lg:pb-32 sm:pb-28 pb-20 flex md:flex-row flex-col gap-10 max-w-screen-md mx-auto w-full',
              {
                'items-center': isIntroSection,
              },
            )}
          >
            <div className="flex items-start justify-start flex-shrink-0">
              <Image
                src={section.image.url}
                alt={section.image.alt}
                width={300}
                height={300}
                quality={100}
              />
            </div>
            <div className="w-full">
              {!isIntroSection && (
                <span className="uppercase font-bold text-sm text-gray-600 leading-none block pb-2">
                  Section {i++}
                </span>
              )}
              <Link
                href={{
                  pathname: '/learn/[module]/[section]',
                  query: {
                    module: module.slug,
                    section: section.slug,
                  },
                }}
                passHref
              >
                <a className="hover:underline text-[1.6rem] font-bold inline-block leading-tight">
                  {section.title}
                </a>
              </Link>
              {isIntroSection && (
                <div>
                  <Link
                    href={{
                      pathname: '/learn/[module]/[section]',
                      query: {
                        module: module.slug,
                        section: section.slug,
                      },
                    }}
                    passHref
                  >
                    <a className="uppercase font-bold text-xs text-white px-3 py-2 hover:bg-teal-800 transition leading-none inline-flex bg-teal-700 rounded-md mt-2">
                      Start Here
                    </a>
                  </Link>
                </div>
              )}
              {isIntroSection ? null : (
                <div className="prose pt-5">
                  <PortableText
                    components={PortableTextComponents}
                    value={section.body}
                  />
                </div>
              )}
              {section.lessons && (
                <div className="pt-8">
                  <strong>Lessons</strong>
                  <ol className="list-none pt-2 divide-y divide-gray-100">
                    {section.lessons.map(
                      (lesson: SanityDocument, i: number) => (
                        <li
                          data-index={i + 1}
                          key={lesson.slug}
                          className="relative flex items-baseline before:pt-4 before:opacity-60 before:absolute before:content-[attr(data-index)] before:text-xs marker:text-gray-400 hover:bg-white before:pl-2 -mx-2"
                        >
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
                            <a className="text-gray-800 hover:text-gray-900 px-3 py-3 font-semibold transition pl-6 inline-flex">
                              {lesson.title}
                            </a>
                          </Link>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default Learn
