import React from 'react'
import Layout from '@/components/app/layout'
import {getAllTutorials} from '@/lib/tutorials'
import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import Heading from '@/components/heading'

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

const pageDescription =
  'A collection of free, exercise-driven, in-depth TypeScript tutorials for you to use on your journey to TypeScript wizardry.'

const TutorialsPage: React.FC<{tutorials: Module[]}> = ({tutorials}) => {
  return (
    <Layout
      meta={{
        title: `Free TypeScript Tutorials from Matt Pocock`,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1663164063/tutorials-card_2x_gsi059.png',
        },
      }}
    >
      <Heading
        title="Free TypeScript Tutorials"
        description={pageDescription}
      />
      <main className="relative z-10 flex flex-col items-center justify-center">
        {tutorials && (
          <ul className="flex max-w-screen-lg flex-col gap-5 px-5 py-10 sm:gap-5 sm:py-20">
            {tutorials.map(({title, slug, image, description, sections}, i) => {
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border bg-card p-10 shadow-2xl md:flex-row"
                >
                  {image && (
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                      className="flex flex-shrink-0 items-center justify-center"
                    >
                      <Image
                        src={image}
                        alt={title}
                        width={300}
                        quality={100}
                        height={300}
                      />
                    </Link>
                  )}
                  <div>
                    <h2>
                      <Link
                        href={{
                          pathname: '/tutorials/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                        className="text-3xl font-semibold hover:underline sm:text-4xl"
                      >
                        {title}
                      </Link>
                    </h2>
                    <div className="mt-3 pb-3 font-mono text-xs font-semibold uppercase text-primary">
                      {i === 0 && (
                        <span className="mr-3 rounded-full bg-primary px-2 py-0.5 font-sans font-semibold uppercase text-primary-foreground">
                          New
                        </span>
                      )}
                      {sections && (
                        <>{sectionsFlatMap(sections).length} exercises</>
                      )}
                    </div>
                    {description && (
                      <p className="mt-5 text-gray-300">{description}</p>
                    )}
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                      className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700"
                    >
                      View{' '}
                      <span
                        aria-hidden="true"
                        className="text-gray-300 transition group-hover:text-white"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default TutorialsPage
