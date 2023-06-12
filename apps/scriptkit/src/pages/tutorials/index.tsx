import React from 'react'
import Layout from 'layouts'
import {getAllTutorials} from 'lib/tutorials'
import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import pluralize from 'pluralize'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  return {
    props: {tutorials},
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

const TutorialsPage: React.FC<{
  tutorials: Module[]
}> = ({tutorials}) => {
  const publishedTutorials = tutorials.filter(
    (tutorial: any) => tutorial.state === 'published',
  )

  return (
    <Layout
      meta={{
        title: `Free Script Kit Tutorials from John Lindquist`,
        description: `Free Script Kit tutorials by John Lindquist that will help you learn to automate your daily programming tasks.`,
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-24">
        <h1 className="font-heading px-5 text-center text-3xl font-bold sm:text-4xl">
          Free Script Kit Tutorials
        </h1>
        <p className="max-w-lg px-5 pt-8 text-center text-lg text-gray-600 dark:text-gray-400">
          <Balancer>
            A collection of free, in-depth Script Kit tutorials.
          </Balancer>
        </p>
        {publishedTutorials && (
          <ul className="w-full flex max-w-screen-md flex-col gap-5 px-5 pt-10 sm:gap-8 sm:pt-20">
            {publishedTutorials.map(
              ({title, slug, image, description, sections}, i) => {
                return (
                  <li key={slug.current}>
                    <Link
                      className="relative flex flex-col items-center gap-10 overflow-hidden w-full rounded-xl border border-gray-200 bg-gradient-to-tr p-10 shadow-2xl shadow-gray-600/20 transition hover:bg-gray-100/80 dark:border-gray-700/50 dark:shadow-none dark:hover:bg-gray-900/40 md:flex-row"
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
                            width={220}
                            quality={100}
                            height={220}
                          />
                        </div>
                      )}{' '}
                      {i === 0 && (
                        <span className="absolute right-5 top-5 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border-transparent bg-gray-900 text-amber-300">
                          New
                        </span>
                      )}
                      <div>
                        <h2 className="text-2xl font-semibold sm:text-3xl">
                          <Balancer>{title}</Balancer>
                        </h2>
                        <div className="flex items-center gap-3 pt-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full">
                            <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-900">
                              <Image
                                src={require('../../../public/john-lindquist.jpeg')}
                                alt="John Lindquist"
                                width={48}
                                height={48}
                              />
                            </div>
                            <span>John Lindquist</span>
                          </div>
                          {'・'}
                          {sections && sectionsFlatMap(sections).length}{' '}
                          {sections &&
                            pluralize(
                              sectionsFlatMap(sections)[0]._type,
                              sectionsFlatMap(sections).length,
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
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default TutorialsPage
