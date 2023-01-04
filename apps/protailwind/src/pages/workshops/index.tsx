import React from 'react'
import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {getAllWorkshops} from '../../lib/workshops'

export async function getStaticProps() {
  const tutorials = await getAllWorkshops()

  return {
    props: {tutorials: tutorials.reverse()},
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
          title: `Free Tailwind Tutorials from Simon Vrachliotis`,
          description: `Free Tailwind tutorials by Simon Vrachliotis that will help you learn how to use Tailwind as a professional web developer through exercise driven examples.`,
          ogImage: {
            url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1668155873/tutorials/card_2x.png',
          },
        } as any
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="text-center font-heading text-4xl font-black sm:text-5xl lg:text-6xl">
          Pro Tailwind Workshops
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-brand-red">
          A collection of free, exercise-driven, in-depth Tailwind workshops for
          you to use on your journey to Tailwind Pro.
        </p>
        {tutorials && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {tutorials.map(
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
                      <div className="pt-4 pb-3 font-mono text-xs font-semibold uppercase text-gray-600 ">
                        {i === 0 && (
                          <span className="mr-3 rounded-full bg-gray-100 px-2 py-0.5 font-sans font-semibold uppercase text-gray-700">
                            New
                          </span>
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
                      <Link
                        href={{
                          pathname: '/workshops/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                      >
                        <a className="font-heading text-3xl font-black hover:underline sm:text-4xl">
                          {title}
                        </a>
                      </Link>

                      {description && <p className="mt-2">{description}</p>}
                      <Link
                        href={{
                          pathname: '/workshops/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                      >
                        <a className="group my-4 inline-block gap-2 rounded-full bg-brand-red px-4 py-2 font-medium text-white transition">
                          View{' '}
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
