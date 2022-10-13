import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses} from 'lib/courses'
import Link from 'next/link'
import Image from 'next/image'

export async function getStaticProps() {
  const tutorials = await getAllCourses()

  return {
    props: {tutorials},
    revalidate: 10,
  }
}

const TutorialsPage: React.FC<{tutorials: SanityDocument[]}> = ({
  tutorials,
}) => {
  return (
    <div>
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="text-5xl font-bold text-center font-heading sm:text-5xl">
          Cursos Profesionales de Frontend
        </h1>
        <p className="max-w-sm pt-8 text-lg text-center ">
          Cursos profesionales de desarrollo frontend.
        </p>

        {tutorials && (
          <ul className="flex flex-col max-w-screen-lg gap-8 px-3 pt-20">
            {tutorials.map(
              ({title, slug, image, description, exercises}, i) => {
                return (
                  <Link
                    href={{
                      pathname: '/aprende/[module]',
                      query: {
                        module: slug.current,
                      },
                    }}
                  >
                    <a>
                      <li className="p-10 text-white bg-black border rounded-lg shadow-2xl">
                        <h1 className="mx-auto mb-12 text-2xl font-black tracking-tight sm:max-w-3xl md:max-w-4xl lg:text-6xl">
                          {title}
                        </h1>
                        <p className="prose text-white">{description}</p>
                      </li>
                    </a>
                  </Link>
                )
              },
            )}
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
        fill-rule="evenodd"
        d="M0 24.586v2.828l26-26V0h-1.414L0 24.586Zm26-12-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-24.96 24.96c.229.696.492 1.377.79 2.039L26 533.414v-2.828Zm0 14L6.447 564.139c.481.463.985.904 1.509 1.32L26 547.414v-2.828Zm0 14-10.646 10.646c.757.211 1.532.381 2.322.506L26 561.414v-2.828Z"
        clip-rule="evenodd"
      />
      <path stroke="#1F2937" stroke-width="2" d="M27 0v570" />
    </svg>
  )
}

export default TutorialsPage
