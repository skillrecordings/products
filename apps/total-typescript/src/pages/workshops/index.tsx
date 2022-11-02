import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {getAllWorkshops} from 'lib/workshops'

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/dpr_auto,f_auto,q_auto:good/`

export async function getStaticProps() {
  const workshops = await getAllWorkshops()

  console.log(workshops)

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
        <h1 className="text-center font-heading text-5xl font-bold sm:text-5xl">
          Professional TypeScript Workshops
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-rose-100/90">
          A collection of profesional, exercise-driven, in-depth, self-paced
          TypeScript workshops for you to achieve TypeScript wizardry.
        </p>
        {modules && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {modules.map(({title, slug, image, description, sections}, i) => {
              console.log(image)
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-10 shadow-2xl md:flex-row"
                >
                  <div className="flex flex-shrink-0 items-center justify-center">
                    <Image
                      src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
                      alt={title}
                      width={300}
                      quality={100}
                      height={300}
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
                      <a className="text-3xl font-semibold hover:underline sm:text-4xl">
                        {title}
                      </a>
                    </Link>
                    <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-cyan-300">
                      {i === 0 && (
                        <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
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
                      <a className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700">
                        View{' '}
                        <span
                          aria-hidden="true"
                          className="text-gray-300 transition group-hover:text-white"
                        >
                          →
                        </span>
                      </a>
                    </Link>
                  </div>
                  <StripesLeft className="absolute left-0 top-0 hidden w-5 md:block" />
                </li>
              )
            })}
          </ul>
        )}
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}

const StripesLeft: React.FC<{className?: string}> = ({className = ''}) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 28 570"
    >
      <path
        fill="#1F2937"
        fillRule="evenodd"
        d="M0 24.586v2.828l26-26V0h-1.414L0 24.586Zm26-12-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-24.96 24.96c.229.696.492 1.377.79 2.039L26 533.414v-2.828Zm0 14L6.447 564.139c.481.463.985.904 1.509 1.32L26 547.414v-2.828Zm0 14-10.646 10.646c.757.211 1.532.381 2.322.506L26 561.414v-2.828Z"
        clipRule="evenodd"
      />
      <path stroke="#1F2937" strokeWidth="2" d="M27 0v570" />
    </svg>
  )
}

export default WorkshopsPage
