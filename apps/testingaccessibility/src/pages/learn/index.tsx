import * as React from 'react'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {serialize} from '@skillrecordings/commerce-server'
import {useProgress} from 'context/progress-context'
import {
  getModuleProgressForUser,
  getNextUpLesson,
  getSectionProgressForUser,
} from 'utils/progress'
import {getPathForLesson} from 'utils/get-resource-paths'
import {ChevronRightIcon} from '@heroicons/react/solid'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import Search from 'components/search/autocomplete'
import GetCertificate from 'components/certificate'
import Layout from 'components/app/layout'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import groq from 'groq'
import {Purchase} from '@skillrecordings/database'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'

const CERTIFICATE_ENABLED = process.env.NEXT_PUBLIC_CERTIFICATE_ENABLED

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

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  // TODO: instead of fetching the product we can generate rules on the session
  //       which may mean we can avoid this async call but it also isn't hurting
  //       anything right now. The ability isn't being used to make any decisions
  //       at this point.
  const {product, purchases} = await getPurchasedProduct(req, productQuery)

  if (purchases) {
    return {
      props: {
        product,
        purchases: purchases.map(serialize),
      },
    }
  }
  return {
    redirect: {
      destination: '/buy',
      permanent: false,
    },
  }
}

const Learn: React.FC<
  React.PropsWithChildren<{purchases: Purchase[]; product: SanityDocument}>
> = ({product}) => {
  const {title, modules} = product
  const {progress, isLoadingProgress} = useProgress()
  const nextUpLesson = !isLoadingProgress && getNextUpLesson(progress, modules)

  return (
    <Layout
      className="bg-green-700 bg-noise"
      meta={{title: 'Testing Accessibility Workshops'}}
    >
      <main>
        <nav className="w-full bg-green-800/40" aria-label="Search">
          <div className="mx-auto py-[2px] w-full max-w-screen-lg flex">
            <Search product={product} />
          </div>
        </nav>
        <div className="max-w-screen-md mx-auto w-full lg:p-1 p-5 lg:pt-10 pt-10 lg:pb-32 pb-16">
          <header className="pt-10 pb-24 text-white flex flex-col items-center justify-center">
            <h1 className="font-heading text-5xl font-bold text-center max-w-lg">
              Testing Accessibility Workshops
            </h1>
            <Link
              href={
                nextUpLesson
                  ? {
                      pathname: '/learn/[module]/[section]/[lesson]',
                      query: getPathForLesson(
                        nextUpLesson.slug,
                        product.modules,
                      ),
                    }
                  : {
                      pathname: '/learn/[module]',
                      query: {module: 'foundations-of-accessibility'},
                    }
              }
            >
              <a className="flex items-center font-medium gap-2 mt-8 px-4 py-2.5 rounded-md border border-white/20 hover:bg-white/5 transition focus-visible:ring-white">
                {isEmpty(progress) ? 'Start' : 'Continue'} Learning{' '}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="w-4 h-4 mt-0.5"
                />
              </a>
            </Link>
          </header>
          {/* <h1 className="font-nav text-center text-2xl leading-none font-bold text-white py-10">
            {title}
          </h1> */}
          <div className="grid grid-cols-1 gap-16 w-full">
            {modules.map((module: SanityDocument, i: number) => {
              const {title, slug, image, sections} = module
              const {completedSections, isCompleted} = getModuleProgressForUser(
                progress,
                sections,
              )
              return (
                <ol key={slug} className="text-white">
                  <li className="flex md:flex-row flex-col md:items-start items-center justify-center">
                    <div
                      className={cx(
                        'flex items-center justify-center flex-shrink-0 hover:rotate-0 transition ease-in-out duration-300',
                        {'md:-rotate-2': i % 2 === 0},
                        {'md:rotate-2': i % 2 === 1},
                      )}
                    >
                      <Image
                        className="drop-shadow-xl"
                        src={image.url}
                        alt={image.alt}
                        width={350}
                        height={350}
                        quality={100}
                      />
                    </div>
                    <div className="w-full md:pt-16">
                      <Link
                        href={{
                          pathname: '/learn/[module]',
                          query: {module: slug},
                        }}
                        passHref
                      >
                        <a className="hover:underline sm:text-4xl text-3xl leading-tight font-bold mt-2 inline-flex justify-center w-full font-heading md:text-left text-center focus-visible:ring-white">
                          <h2>{title}</h2>
                        </a>
                      </Link>
                      <ol className="pt-5 list-none">
                        {sections?.map((section: SanityDocument, i: number) => {
                          const {title} = section
                          const {isCompleted: isSectionCompleted} =
                            getSectionProgressForUser(progress, section.lessons)

                          const isCompleted =
                            isSectionCompleted ??
                            find(progress, {lessonSlug: section.slug})
                              ?.completedAt

                          return (
                            <li
                              key={title}
                              className="group md:-ml-4 relative flex items-baseline before:opacity-60 before:absolute before:content-[attr(data-index)] before:text-xs marker:text-gray-400 before:pl-2"
                            >
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
                                <a
                                  aria-label={`${title} ${
                                    isCompleted ? '(completed)' : ''
                                  }`}
                                  data-index={isCompleted ? '✓' : i + 1}
                                  className={cx(
                                    `after:content-[""] after:absolute after:left-[21.5px] after:top-0 group-first-of-type:after:top-1/2 group-first-of-type:after:h-1/2 after:w-px after:bg-white/20 after:h-full group rounded-md pl-3 group-hover:bg-green-800/20 text-sand-100 hover:text-white focus-visible:ring-white w-full font-medium py-4 transition relative items-center inline-flex before:font-semibold before:z-10 before:flex before:items-center before:justify-center before:font-mono before:content-[attr(data-index)] before:w-5 before:h-5 before:left-0 before:rounded-full before:flex-shrink-0`,
                                    {
                                      'before:text-[0.55em] before:text-sans-500/50 before:border before:border-white/20 before:bg-green-700 before:bg-noise':
                                        !isCompleted,
                                      'before:text-sm before:text-white  before:bg-green-500':
                                        isCompleted,
                                      'after:hidden':
                                        sections.length === 1 &&
                                        !CERTIFICATE_ENABLED,
                                      'group-last-of-type:after:bottom-1/2 group-last-of-type:after:h-1/2':
                                        !CERTIFICATE_ENABLED,
                                    },
                                  )}
                                >
                                  <span className="inline-flex pl-2">
                                    {title}
                                  </span>
                                </a>
                              </Link>
                            </li>
                          )
                        })}
                        {CERTIFICATE_ENABLED && sections?.length > 0 ? (
                          <li
                            key={`certificate-${title}`}
                            className={cx(
                              `w-full group mt-7 after:content-[""] after:absolute after:left-[21.5px] after:bottom-1/2 after:w-px after:bg-white/20 after:h-full md:-ml-4 relative flex items-baseline group`,
                            )}
                          >
                            <GetCertificate
                              isAvailable={isCompleted ?? false}
                              module={module}
                            />
                          </li>
                        ) : null}
                      </ol>
                    </div>
                  </li>
                </ol>
              )
            })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Learn
