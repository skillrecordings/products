import React from 'react'
import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import {getAllPlaylists} from 'lib/playlists'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

export async function getStaticProps() {
  const playlists = await getAllPlaylists()

  return {
    props: {modules: playlists.reverse()},
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
        <h1 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl">
          Professional TypeScript Workshops
        </h1>
        {modules && (
          <ul className="flex max-w-screen-md flex-col gap-5 px-5 pt-10 sm:gap-8 sm:pt-20">
            {modules.map(
              ({title, slug, image, description, sections, state}, i) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-8 shadow-2xl md:flex-row"
                  >
                    <div className="w-full">
                      {state === 'draft' ? (
                        <h2 className="text-3xl font-semibold sm:text-4xl">
                          {title}
                        </h2>
                      ) : (
                        <Link
                          href={{
                            pathname: '/playlists/[module]',
                            query: {
                              module: slug.current,
                            },
                          }}
                        >
                          <h2 className="text-3xl font-semibold hover:underline sm:text-4xl">
                            {title}
                          </h2>
                        </Link>
                      )}
                      <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-cyan-300">
                        {state === 'draft' ? (
                          <span className="mr-3 rounded-full bg-gray-700 px-2 py-0.5 font-sans font-semibold uppercase text-gray-200">
                            Coming Soon
                          </span>
                        ) : (
                          i === 0 && (
                            <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                              New
                            </span>
                          )
                        )}
                        {sections && state !== 'draft' ? (
                          <>
                            {sections.length} sections,{' '}
                            {sections.reduce(
                              (acc: number, section: {lessons?: any[]}) =>
                                section.lessons?.length
                                  ? section.lessons?.length + acc
                                  : acc,
                              0,
                            )}{' '}
                            exercises
                          </>
                        ) : (
                          <br />
                        )}
                      </div>

                      {description && (
                        <p className="text-gray-300">{description}</p>
                      )}
                      {state !== 'draft' && (
                        <Link
                          href={{
                            pathname: '/playlists/[module]',
                            query: {
                              module: slug.current,
                            },
                          }}
                          className="group mt-5 inline-block gap-2 rounded bg-gray-800 py-2 pl-4 pr-6 font-medium transition hover:bg-gray-700"
                          onClick={() => {
                            track('clicked view workshop module', {
                              module: slug.current,
                            })
                          }}
                        >
                          <span className="pr-2">View</span>
                          <span
                            aria-hidden="true"
                            className="absolute text-gray-300 transition group-hover:translate-x-1 group-hover:text-white"
                          >
                            →
                          </span>
                        </Link>
                      )}
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

export default WorkshopsPage
