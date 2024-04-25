import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from 'lib/tutorials'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import ResourceContributor from 'components/resource-contributor'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  return {
    props: {tutorials},
    revalidate: 10,
  }
}

// There are multiple sections containing arrays of lessons. I'd like to flat map them into a single array of lessons.
const sectionsFlatMap = (sections: any[]) => {
  const map = sections?.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const TutorialsPage: React.FC<{tutorials: SanityDocument[]}> = ({
  tutorials,
}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title: `Free Web Development Tutorials`,
        description: `Free Web Development that will help you learn professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1704808424/card-tutorials_2x.png',
        },
      }}
    >
      {' '}
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 pt-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          <span className="block text-xs uppercase tracking-widest text-gray-500">
            Free
          </span>{' '}
          Web Development Tutorials
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
          <Balancer>
            A collection of exercise-driven, in-depth Web Development tutorials.
          </Balancer>
        </h2>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center pt-16">
        {tutorials && (
          <ul className="grid w-full max-w-screen-lg grid-cols-1 flex-col gap-5 px-5 sm:gap-8 lg:grid-cols-2">
            {tutorials.map(
              ({title, slug, image, description, sections, instructor}, i) => {
                return (
                  <li key={slug.current}>
                    <Link
                      className="relative flex h-full flex-col items-center gap-10 overflow-hidden rounded bg-white p-10 shadow-2xl shadow-gray-500/20 transition hover:bg-gray-50 dark:border-transparent dark:bg-gray-900 dark:shadow-none dark:hover:brightness-110"
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      {image && (
                        <div className="flex flex-shrink-0 items-center justify-center">
                          <Image
                            src={image}
                            alt={title}
                            width={240}
                            quality={100}
                            height={240}
                            priority
                          />
                        </div>
                      )}{' '}
                      <div className="w-full">
                        {' '}
                        {i === 0 && (
                          <span className="absolute right-5 top-5 rounded-full border border-gray-200 bg-transparent px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-transparent dark:bg-amber-400/20 dark:text-amber-300">
                            New
                          </span>
                        )}
                        <h3 className="mt-3 w-full max-w-xl text-2xl font-semibold sm:text-3xl">
                          <Balancer>{title}</Balancer>
                        </h3>
                        <div className="flex items-center gap-3 pt-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full">
                            <ResourceContributor
                              name={instructor?.name}
                              slug={instructor?.slug}
                              image={instructor?.picture?.url}
                              as="div"
                            />
                          </div>
                          {sectionsFlatMap(sections) && (
                            <>
                              {'・'}
                              <div>
                                {sectionsFlatMap(sections)?.length}{' '}
                                {pluralize(
                                  sectionsFlatMap(sections)[0]._type,
                                  sectionsFlatMap(sections)?.length,
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {description && (
                          <p className="text-gray-300">{description}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              },
            )}
            {/* <li
              id="tutorials-index"
              className="relative flex flex-col items-center justify-center gap-10 overflow-hidden rounded-xl border-2 border-dashed p-10 text-xl text-gray-600 transition dark:border-white/5 dark:text-gray-400"
            >
              <h3>More tutorials coming soon!</h3>
              {!subscriber && (
                <SubscribeToConvertkitForm
                  onSuccess={(subscriber: any) => {
                    if (subscriber) {
                      const redirectUrl = redirectUrlBuilder(
                        subscriber,
                        '/confirm',
                      )
                      router.push(redirectUrl)
                    }
                  }}
                />
              )}
            </li> */}
          </ul>
        )}

        {!subscriber && <PrimaryNewsletterCta className="mt-20" />}
      </main>
    </Layout>
  )
}

export default TutorialsPage
