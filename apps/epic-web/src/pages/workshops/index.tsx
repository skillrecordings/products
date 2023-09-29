import React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import {useRouter} from 'next/router'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {getAllWorkshops} from 'lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import reverse from 'lodash/reverse'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()

  return {
    props: {workshops},
    revalidate: 10,
  }
}

// There are multiple sections containing arrays of lessons. I'd like to flat map them into a single array of lessons.
const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const WorkshopsPage: React.FC<{workshops: Module[]}> = ({workshops}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title: `Professinal Web Development Workshops from Kent C. Dodds`,
        description: `Professinal Web Development workshops by Kent C. Dodds that will help you learn professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1694113076/card-workshops_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 pt-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          <span className="block text-xs uppercase tracking-widest text-gray-500">
            Professional
          </span>{' '}
          Web Development Workshops
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
          <Balancer>
            A collection of exercise-driven, in-depth Web Development workshops.
          </Balancer>
        </h2>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center pb-16 pt-16">
        {workshops && (
          <ul className="flex w-full max-w-screen-lg flex-col gap-5 px-5 sm:gap-8">
            {reverse(workshops).map(
              ({title, slug, image, description, sections}, i) => {
                return (
                  <li key={slug.current}>
                    <Link
                      className="relative flex flex-col items-center gap-10 overflow-hidden rounded p-10 drop-shadow-sm transition hover:bg-gray-100 dark:border-transparent dark:bg-white/5 dark:hover:bg-white/10 sm:flex-row sm:gap-16"
                      href={{
                        pathname: '/workshops/[module]',
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
                            width={350}
                            quality={100}
                            height={350}
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
                        <h3 className="mt-3 w-full max-w-xl text-2xl font-semibold sm:text-3xl">
                          <Balancer>{title}</Balancer>
                        </h3>
                        {/* {description && ( */}
                        <div className="pt-5">
                          <p className="text-gray-600 dark:text-gray-300">
                            <Balancer>
                              {
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ornare eros. Donec semper libero quis venenatis tempor. Donec id vestibulum erat. Praesent ultricies accumsan massa vel tincidunt. Maecenas interdum ipsum fermentum tellus egestas, quis ultrices dui blandit. Maecenas mattis congue eros, at pharetra ex cursus suscipit. Duis orci ipsum, fringilla ac vulputate ac, tincidunt a sapien.'
                              }
                            </Balancer>
                          </p>
                        </div>
                        {/* )} */}
                        <div className="flex items-center gap-3 pt-6 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full">
                            <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                              <Image
                                src={require('../../../public/kent-c-dodds.png')}
                                alt="Kent C. Dodds"
                                width={48}
                                height={48}
                              />
                            </div>
                            <span>Kent C. Dodds</span>
                          </div>
                          {'・'}
                          {sections && (
                            <div>
                              {sectionsFlatMap(sections).length}{' '}
                              {pluralize(
                                sectionsFlatMap(sections)[0]._type,
                                sectionsFlatMap(sections).length,
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              },
            )}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopsPage
