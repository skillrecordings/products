import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses} from 'lib/courses'
import Link from 'next/link'
import Image from 'next/image'

export async function getStaticProps() {
  const modules = await getAllCourses()

  return {
    props: {modules},
    revalidate: 10,
  }
}

const ModulesPage: React.FC<{modules: SanityDocument[]}> = ({modules}) => {
  return (
    <div>
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="text-5xl font-bold text-center font-heading sm:text-5xl">
          Cursos Profesionales de Frontend
        </h1>
        <p className="max-w-sm pt-8 text-lg text-center ">
          Cursos profesionales de desarrollo frontend.
        </p>

        {modules && (
          <ul className="flex flex-col max-w-screen-lg gap-8 px-3 pt-20">
            {modules.map(({title, slug, description}) => {
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
            })}
          </ul>
        )}
      </main>
    </div>
  )
}

export default ModulesPage
