import * as React from 'react'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {serialize} from 'utils/prisma-next-serializer'
import {useProgress} from 'context/progress-context'
import {
  getModuleProgressForUser,
  getNextUpLesson,
  getSectionProgressForUser,
} from 'utils/progress'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {Purchase} from '@prisma/client'
import Search from 'components/search/autocomplete'
import Layout from 'components/app/layout'
import Link from 'next/link'
import groq from 'groq'
import Image from 'next/image'
import cx from 'classnames'
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
                      <a className="hover:underline sm:text-4xl text-3xl leading-tight font-bold mt-2 inline-flex font-heading md:text-left text-center focus-visible:ring-white">
                        {title}
                      </a>
                    </Link>
                    <ol className="pt-5 list-none">
                      {sections?.map((section: SanityDocument, i: number) => {
                        const {title} = section
                        const {isCompleted} = getSectionProgressForUser(
                          progress,
                          section.lessons,
                        )

                        return (
                          <li
                            key={title}
                            // className="group marker:text-sand-100 marker:pr-2 marker:text-sm marker:font-mono py-1 text-sand-100 text-lg transition"
                            className="md:-ml-4 relative flex items-baseline before:opacity-60 before:absolute before:content-[attr(data-index)] before:text-xs marker:text-gray-400 before:pl-2 group "
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
                                  `group rounded-md pl-4 group-hover:bg-green-800/20 text-sand-100 hover:text-white focus-visible:ring-white w-full font-medium py-4 transition relative items-center inline-flex before:font-semibold before:flex before:items-center before:justify-center before:font-mono before:content-[attr(data-index)] before:w-5 before:h-5 before:left-0 before:rounded-full before:flex-shrink-0`,
                                  {
                                    'before:text-[0.55em] before:text-sans-500/50 before:border before:border-white/20':
                                      !isCompleted,
                                    'before:text-sm before:text-white  before:bg-green-500':
                                      isCompleted,
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
                    </ol>
                  </div>
                </li>
              </ol>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export default Learn
