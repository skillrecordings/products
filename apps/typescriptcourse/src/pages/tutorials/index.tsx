import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from 'lib/tutorials'
import Link from 'next/link'
import Image from 'next/legacy/image'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  return {
    props: {tutorials},
    revalidate: 10,
  }
}

const TutorialsPage: React.FC<{tutorials: SanityDocument[]}> = ({
  tutorials,
}) => {
  return (
    <Layout
      className="overflow-hidden"
      meta={
        {
          title: `Free TypeScript Tutorials from Joe Previte`,
          description: `Free TypeScript tutorials by Joe Previte that will help you learn how to use TypeScript as a professional web developer.`,
          ogImage: {
            url: 'https://res.cloudinary.com/skill-recordings-inc/image/upload/v1671649180/Tutorials%20Assets/card_2x_sexd1e.png',
          },
        } as any
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="max-w-screen-md mx-auto text-5xl font-bold leading-none text-center font-heading sm:text-5xl lg:text-5xl">
          Free
          <span className="text-transparent bg-gradient-to-l from-purple-400 to-blue-400 bg-clip-text decoration-clone">
            {' '}
            TypeScript
          </span>{' '}
          Tutorials
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-brand-red">
          A collection of free in-depth TypeScript tutorials for you to use.
        </p>
        {tutorials && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {tutorials.map(({title, slug, image, description, lessons}, i) => {
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center rounded-lg bg-white bg-opacity-5 p-4 md:flex-row shadow-2xl overflow-hidden gap-6"
                >
                  <div className="flex h-full flex-shrink-0 items-center justify-center p-5">
                    {image && (
                      <Image
                        src={image}
                        alt={title}
                        width={200}
                        height={200}
                        quality={100}
                      />
                    )}
                  </div>
                  <div className="pr-10">
                    <div className="relative pt-4 pb-3 font-mono text-xs font-semibold uppercase text-blue-400">
                      {i === 0 && (
                        <span className="mr-3 px-2 py-0.5 font-sans font-semibold uppercase transition bg-white rounded-full bg-opacity-10 group focus-visible:ring-white focus-visible:opacity-100">
                          New
                        </span>
                      )}
                      {lessons.length} lessons
                    </div>
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      <a className="text-3xl font-bold leading-none font-heading hover:underline">
                        {title}
                      </a>
                    </Link>

                    {description && (
                      <p className="text-gray-300 mt-2">{description}</p>
                    )}
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      <a className="mt-5 inline-block gap-2 rounded-full bg-brand-red px-4 py-2 font-medium text-white transition bg-white bg-opacity-0 rounded-full bg-opacity-10 group hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100">
                        View{' '}
                        <span
                          aria-hidden="true"
                          className="text-white transition group-hover:text-white"
                        >
                          →
                        </span>
                      </a>
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
