import * as React from 'react'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {serialize} from 'utils/prisma-next-serializer'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {getModuleProgressForUser, getNextUpLesson} from 'utils/progress'
import {LessonProgress} from '@prisma/client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {Purchase} from '@prisma/client'
import PortableTextComponents from 'components/portable-text'
import Search from 'components/search/autocomplete'
import Layout from 'components/app/layout'
import find from 'lodash/find'
import Link from 'next/link'
import cx from 'classnames'
import groq from 'groq'
import Image from 'next/image'
import {getCurrentAbility} from '../../server/ability'
import {subject} from '@casl/ability'
import {getSession} from 'next-auth/react'

const productQuery = groq`*[_type == "product" && productId == $productId][0]{
  title,
  productId,
  modules[]->{
    title,
    "slug": slug.current,
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
  }
  }`

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const session = await getSession({req})

  // TODO: instead of fetching the product we can generate rules on the session
  //       which may mean we can avoid this async call but it also isn't hurting
  //       anything right now. The ability isn't being used to make any decisions
  //       at this point.
  const {product, purchases} = await getPurchasedProduct(req, productQuery)

  const ability = getCurrentAbility({rules: session?.rules})

  console.log(
    `LEARN: can invite team members: ${ability.can('invite', 'Team')}`,
  )
  console.log(`LEARN: can view content: ${ability.can('view', 'Content')}`)

  console.log(
    `LEARN: can view product: ${ability.can(
      'view',
      subject('Product', product),
    )}`,
  )

  if (purchases) {
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
  product,
}) => {
  const {title, modules} = product
  const {progress, isLoadingProgress} = useProgress()
  const nextUpLesson = !isLoadingProgress && getNextUpLesson(progress, modules)

  return (
    <Layout className="bg-green-700 bg-noise">
      <header className="w-full bg-gray-100">
        <div className="mx-auto py-[2px] w-full max-w-screen-lg flex">
          <Search product={product} />
        </div>
      </header>
      <main className="max-w-screen-md mx-auto w-full lg:p-1 p-5 lg:pt-10 pt-10 lg:pb-32 pb-16">
        {/* <h1 className="font-nav text-center text-2xl leading-none font-bold text-white py-10">
          {title}
        </h1> */}
        <div className="grid grid-cols-1 gap-16 w-full">
          {modules.map((module: SanityDocument) => {
            const {title, slug, image, sections} = module
            const {completedSections, isCompleted} = getModuleProgressForUser(
              progress,
              sections,
            )
            return (
              <ol key={slug} className="text-white">
                <li className="flex md:flex-row flex-col items-center justify-center">
                  <Link
                    href={{
                      pathname: '/learn/[module]',
                      query: {module: slug},
                    }}
                    passHref
                  >
                    <a className="flex items-center justify-center flex-shrink-0">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={350}
                        height={350}
                        quality={100}
                      />
                    </a>
                  </Link>
                  <div className=" w-full">
                    <Link
                      href={{
                        pathname: '/learn/[module]',
                        query: {module: slug},
                      }}
                      passHref
                    >
                      <a className="hover:underline text-4xl leading-tight font-bold mt-2 inline-flex font-heading">
                        {title}
                      </a>
                    </Link>
                    <ol className="pt-5 font-display list-decimal list-inside">
                      {sections?.map((section: SanityDocument) => {
                        const {title} = section
                        return (
                          <li className="marker:text-sand-100 hover:underline  py-1 text-sand- text-lg transition">
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
                              <a className="inline-flex">{title}</a>
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </li>
                {/* {sections && (
                <li className="list-none">
                  <Sections progress={progress} module={module} />
                </li>
              )} */}
              </ol>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

type SectionsProps = {
  progress: LessonProgress[]
  module: SanityDocument
}

export const Sections: React.FC<SectionsProps> = ({progress, module}) => {
  return (
    <ol className="pt-16">
      {module.sections.map((section: SanityDocument, i: number) => {
        const isIntroSection = i === 0
        const {image} = section
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
            {image && (
              <div className="flex items-start md:justify-start justify-center flex-shrink-0">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={300}
                  height={300}
                  quality={100}
                />
              </div>
            )}
            <div
              className={cx('w-full', {
                'flex flex-col justify-center md:text-left text-center':
                  isIntroSection,
              })}
            >
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
                    <a className="uppercase font-bold text-xs text-white px-3 py-2 hover:bg-green-700 transition leading-none inline-flex bg-green-600 rounded-md mt-2">
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
                      (lesson: SanityDocument, i: number) => {
                        const isCompleted = find(progress, {
                          lessonSlug: lesson.slug,
                        })?.completedAt

                        return (
                          <li
                            key={lesson.slug}
                            className="relative flex items-baseline before:pt-4 before:opacity-60 before:absolute before:content-[attr(data-index)] before:text-xs marker:text-gray-400 before:pl-2 -mx-2 group"
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
                              <a
                                aria-label={`${lesson.title} ${
                                  isCompleted ? '(completed)' : ''
                                }`}
                                data-index={isCompleted ? '✓' : i + 1}
                                className={cx(
                                  `group-hover:bg-white text-gray-800 hover:text-gray-900 -mx-3 px-3 w-full font-semibold py-4 transition relative items-center inline-flex before:font-semibold before:flex before:items-center before:justify-center before:font-mono before:content-[attr(data-index)] before:w-5 before:h-5 before:left-0 before:rounded-full before:flex-shrink-0`,
                                  {
                                    'before:text-xs before:text-gray-500':
                                      !isCompleted,
                                    'before:text-sm before:text-white before:border-green-600 before:bg-green-600':
                                      isCompleted,
                                  },
                                )}
                              >
                                <span className="pl-3">{lesson.title} </span>
                                {isCompleted && (
                                  <span className="sr-only">(completed)</span>
                                )}
                              </a>
                            </Link>
                          </li>
                        )
                      },
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
