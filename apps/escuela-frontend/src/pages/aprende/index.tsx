import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses} from 'lib/courses'
import Link from 'next/link'

export async function getStaticProps() {
  const courses = await getAllCourses()

  return {
    props: {courses},
    revalidate: 10,
  }
}

const CourseIndexPage: React.FC<{courses: SanityDocument[]}> = ({courses}) => {
  return (
    <div>
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="text-center font-heading text-5xl font-bold sm:text-5xl">
          Free TypeScript Tutorials
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg">
          A collection of free, exercise-driven, in-depth TypeScript tutorials
          for you to use on your journey to TypeScript wizardry.
        </p>
        {courses && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {courses.map(({title, slug, image, description, exercises}, i) => {
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-10 shadow-2xl md:flex-row"
                >
                  <div>
                    <Link
                      href={{
                        pathname: '/aprende/[module]',
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
                    </div>
                    {description && <p className="">{description}</p>}
                    <Link
                      href={{
                        pathname: '/aprende/[module]',
                        query: {
                          module: slug.current,
                        },
                      }}
                    >
                      <a className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700">
                        View{' '}
                        <span
                          aria-hidden="true"
                          className=" transition group-hover:text-white"
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
    </div>
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

export default CourseIndexPage
