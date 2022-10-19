import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses} from 'lib/courses'
import Link from 'next/link'
import Layout from 'components/layout'

export async function getStaticProps() {
  const courses = await getAllCourses()

  return {
    props: {courses},
    revalidate: 10,
  }
}

const CourseIndexPage: React.FC<{courses: SanityDocument[]}> = ({courses}) => {
  return (
    <Layout
      meta={{
        title: ` Cursos de Ingeniería Front-End`,
        description: `Adquiere los conocimientos y las habilidades que necesitas para
        avanzar en tu carrera profesional.`,
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="max-w-screen-md text-center font-heading text-5xl font-bold sm:text-5xl">
          Cursos de Ingeniería Front-End
        </h1>
        <p className="max-w-md pt-8 text-center text-lg">
          Adquiere los conocimientos y las habilidades que necesitas para
          avanzar en tu carrera profesional.
        </p>
        {courses && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {courses.map(({title, slug, description, lessons}, i) => {
              return (
                <li
                  key={slug.current}
                  className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-200 bg-white p-10 shadow-sm md:flex-row"
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
                      <a className="text-3xl font-semibold sm:text-4xl">
                        {title}
                      </a>
                    </Link>
                    <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-black">
                      {i === 0 && (
                        <span className="mr-3 rounded-full bg-green-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                          Nuevo
                        </span>
                      )}
                      {lessons.length} classes
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
                      <a className="group inline-block gap-2 relative z-10 px-5 py-3 mt-2 font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700">
                        Empieza Aqui{' '}
                        <span aria-hidden="true" className=" transition ">
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

export default CourseIndexPage
