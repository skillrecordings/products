import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {getAllWorkshops} from 'lib/workshops'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()

  return {
    props: {modules: workshops},
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{modules: SanityDocument[]}> = ({modules}) => {
  return (
    <Layout
      meta={{
        title: `Professional TypeScript Workshops from Matt Pocock`,
        description: `Professional TypeScript workshops by Matt Pocock that will help you learn TypeScript as a professional web developer through exercise driven examples.`,
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="mx-6 text-center text-4xl font-extrabold leading-tight text-gray-100 sm:text-4xl md:!w-full md:text-5xl lg:text-6xl">
          Workshops Profesionales
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-gray-300">
          A collection of profesional, exercise-driven, in-depth, self-paced
          TypeScript workshops for you to achieve TypeScript wizardry.
        </p>
        {modules && (
          <ul className="flex w-full max-w-4xl flex-col gap-8 px-3 pt-20">
            {modules.map(({title, slug, image, description, sections}, i) => {
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center justify-center gap-10 rounded-lg border border-gray-700 bg-gray-800/30 px-10 py-20 shadow-2xl md:flex-row"
                >
                  <div className="mr-10 flex flex-shrink-0 items-center justify-center">
                    <Image
                      src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
                      alt={title}
                      width={150}
                      height={150}
                      quality={100}
                    />
                  </div>
                  <div>
                    <Link
                      href={{
                        pathname: '/workshops/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      <a className="text-4xl font-bold sm:text-4xl">{title}</a>
                    </Link>
                    <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-gray-300">
                      {i === 0 && (
                        <span className="mr-3 rounded-full bg-brand px-4 py-0.5 font-sans font-semibold uppercase text-gray-100">
                          New
                        </span>
                      )}
                      {sections.length} sections,{' '}
                      {sections.reduce(
                        (acc: number, section: {exercises?: any[]}) =>
                          section.exercises?.length || acc,
                        0,
                      )}{' '}
                      exercises
                    </div>
                    {description && (
                      <p className="text-gray-300">{description}</p>
                    )}
                    <Link
                      href={{
                        pathname: '/workshops/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      <a className="group mt-4 inline-block rounded-md border border-gray-50 bg-gray-50 px-10 py-3 text-base text-gray-900 transition hover:border-gray-50 hover:bg-gray-900 hover:text-gray-50">
                        View{' '}
                        <span
                          className="pr-1"
                          role="presentation"
                          aria-hidden="true"
                        >
                          →
                        </span>{' '}
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

export default WorkshopsPage
