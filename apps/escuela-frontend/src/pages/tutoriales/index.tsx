import React from 'react'
import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from 'lib/tutorials'
import Link from 'next/link'
import Image from 'next/image'

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
      meta={
        {
          title: `Tutoriales interactivos de Escuela Frontend`,
          description: `Avanza tu carrera con tutoriales de ingeniería front-end.`,
          ogImage: {
            url: 'https://res.cloudinary.com/escuela-frontend/image/upload/v1669068727/assets/tutorials-card2x_joxfiy.png',
          },
        } as any
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="text-center font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          Tutoriales Interactivos
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-gray-200">
          Avanza tu carrera con tutoriales interactivos de ingeniería front-end,
          diseñados para optimizar la retención del conocimiento.
        </p>
        {tutorials && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {tutorials.map(
              ({title, slug, image, description, exercises}, i) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-2xl shadow-black/30 md:flex-row"
                  >
                    <div className="flex h-full flex-shrink-0 items-center justify-center p-10 md:bg-brand">
                      {image && (
                        <Image
                          src={image}
                          alt={title}
                          width={260}
                          height={260}
                          quality={100}
                        />
                      )}
                    </div>
                    <div className="pr:0 m-10 md:m-0 md:pr-10">
                      <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-gray-300 ">
                        {i === 0 && (
                          <span className="mr-3 rounded-md bg-white px-2 py-0.5 font-sans font-semibold uppercase text-gray-900">
                            Nuevo
                          </span>
                        )}
                        {exercises.length} ejercicios
                      </div>
                      <Link
                        href={{
                          pathname: '/tutoriales/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                      >
                        <a className="font-heading text-3xl font-bold text-white hover:underline sm:text-4xl">
                          {title}
                        </a>
                      </Link>

                      {description && <p className="mt-2">{description}</p>}
                      <Link
                        href={{
                          pathname: '/tutoriales/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                      >
                        <a className="group my-4 inline-block gap-2 rounded-md bg-brand px-4 py-2 font-medium text-white transition hover:brightness-125">
                          Ver Tutorial{' '}
                          <span
                            aria-hidden="true"
                            className="text-white/90 transition group-hover:text-white"
                          >
                            →
                          </span>
                        </a>
                      </Link>
                    </div>
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
