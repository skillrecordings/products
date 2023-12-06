import React from 'react'
import Layout from '@/components/app/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from '@/lib/tutorials'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export async function getStaticProps() {
  const tutorials = await getAllTutorials().then((tutorials) => {
    // if (process.env.NODE_ENV === 'development') {
    return tutorials
    // } else {
    //   return tutorials.filter((tutorial: any) => tutorial.state === 'published')
    // }
  })

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
        title: `Free Next.js Tutorials by Jack Herrington`,
        description: `Free Next.js tutorials by Jack Herrington that will help you learn professional web development through exercise driven examples.`,
        openGraph: {
          images: [
            {
              url: 'https://res.cloudinary.com/dr0vx1dcs/image/upload/v1694705093/tutorials_2x_knvgra.png',
            },
          ],
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 pt-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          <span className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
            Free
          </span>{' '}
          Next.js Tutorials
        </h1>
        <h2 className=" w-full max-w-md text-base text-gray-600 dark:text-gray-400">
          <Balancer>
            A collection of exercise-driven, in-depth Next.js tutorials.
          </Balancer>
        </h2>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center pt-16 md:pb-5">
        {tutorials && (
          <ul className="grid w-full max-w-screen-lg grid-cols-1 flex-col gap-5 px-5 sm:gap-8 lg:grid-cols-2">
            {tutorials.map(({title, slug, image, description, sections}, i) => {
              return (
                <li key={slug.current}>
                  <Link
                    className="group relative flex flex-col items-center gap-10 overflow-hidden rounded-xl bg-white p-10 drop-shadow-sm transition dark:border-transparent dark:bg-white/5 dark:hover:bg-white/10"
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
                          width={300}
                          height={300}
                          quality={100}
                          priority
                        />
                      </div>
                    )}{' '}
                    <div>
                      {' '}
                      {i === 0 && (
                        <span className="rounded-full border border-gray-200 bg-transparent px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-transparent dark:bg-amber-400/20 dark:text-amber-300">
                          New
                        </span>
                      )}
                      <h3 className="mt-3 w-full max-w-xl text-2xl font-semibold group-hover:text-blue-600 sm:text-3xl">
                        <Balancer>{title}</Balancer>
                      </h3>
                      <div className="flex items-center gap-3 pt-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full">
                          <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                            <Image
                              src={require('../../../public/jack-herrington.jpg')}
                              alt="Jack Herrington"
                              width={48}
                              height={48}
                            />
                          </div>
                          <span>Jack Herrington</span>
                        </div>
                        {sections && (
                          <>
                            {'・'}
                            <div>
                              {sectionsFlatMap(sections).length}{' '}
                              {pluralize(
                                sectionsFlatMap(sections)[0]._type,
                                sectionsFlatMap(sections).length,
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {description && (
                        <p className="pt-4 text-gray-600">{description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
            <li
              id="tutorials-index"
              className="relative flex flex-col items-center justify-center gap-10 overflow-hidden rounded-xl border-2 border-dashed p-10 text-xl text-gray-600 transition dark:border-white/5 dark:text-gray-400 [&_[data-sr-convertkit-subscribe-form]]:flex [&_[data-sr-convertkit-subscribe-form]]:w-full [&_[data-sr-convertkit-subscribe-form]]:flex-col [&_[data-sr-convertkit-subscribe-form]]:justify-center [&_button]:mt-2 [&_input]:mb-5 [&_label]:pb-2"
            >
              <h3 className="text-center font-medium">
                <Balancer>
                  More tutorials are coming soon!{' '}
                  {!subscriber && 'Subscribe to get notified.'}
                </Balancer>
              </h3>
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
            </li>
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default TutorialsPage
