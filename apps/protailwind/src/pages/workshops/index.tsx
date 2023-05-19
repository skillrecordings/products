import React from 'react'
import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {getAllWorkshops} from '../../lib/workshops'
import PageHeadline from 'components/page-headline'
import PageSubheadline from 'components/page-subheadline'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()

  return {
    props: {workshops: workshops.reverse()},
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{workshops: SanityDocument[]}> = ({
  workshops,
}) => {
  return (
    <Layout
      meta={
        {
          title: `Professional Tailwind Workshops from Simon Vrachliotis`,
          description: `Learn how to use Tailwind as a professional web developer through exercise-driven examples.`,
          ogImage: {
            url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1674655491/workshops-card_2x.png',
          },
        } as any
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <PageHeadline>Professional Tailwind Workshops</PageHeadline>
        <PageSubheadline>
          A collection of professional, exercise-driven, in-depth, self-paced
          Tailwind workshops to help you learn how to use Tailwind as a
          professional web developer.
        </PageSubheadline>
        {workshops && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {workshops.map(
              (
                {title, slug, image, description, sections, lessons, state},
                i,
              ) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-500/10 md:flex-row"
                  >
                    <div className="flex h-full flex-shrink-0 items-center justify-center bg-white p-10 md:bg-gray-50">
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
                      <div className="flex items-center gap-1 pb-3 font-mono text-xs font-semibold uppercase text-gray-600">
                        {state === 'draft' && (
                          <span className="mr-3 rounded-full bg-gray-100 px-2 py-0.5 font-sans font-semibold uppercase text-gray-700">
                            Coming Soon
                          </span>
                        )}
                        {i === 0 && state !== 'draft' && (
                          <span className="mr-3 rounded-full bg-gray-100 px-2 py-0.5 font-sans font-semibold uppercase text-gray-700">
                            New
                          </span>
                        )}
                        {sections && state !== 'draft' ? (
                          <>
                            {/* {sections.length} sections,{' '} */}
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
                      {state === 'draft' ? (
                        <h2 className="block font-heading text-3xl font-black sm:text-4xl">
                          {title}
                        </h2>
                      ) : (
                        <h2>
                          <Link
                            href={{
                              pathname: '/workshops/[module]',
                              query: {
                                module: slug.current,
                              },
                            }}
                            className="block font-heading text-3xl font-black hover:underline sm:text-4xl"
                          >
                            {title}
                          </Link>
                        </h2>
                      )}
                      {description && <p className="mt-2">{description}</p>}
                      {(process.env.NODE_ENV === 'development' ||
                        state !== 'draft') && (
                        <Link
                          href={{
                            pathname: '/workshops/[module]',
                            query: {
                              module: slug.current,
                            },
                          }}
                          className="group my-4 inline-block gap-2 rounded-full bg-brand-red px-4 py-2 font-medium text-white transition hover:brightness-110"
                        >
                          View{' '}
                          <span
                            aria-hidden="true"
                            className="text-white/90 transition group-hover:text-white"
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
