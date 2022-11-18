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
          title: `Free Escuela Frontend Tutorials from Escuela Frontend`,
          description: `Free Escuela Frontend tutorials by Escuela Frontend that will help you learn how to use Escuela Frontend as a professional web developer through exercise driven examples.`,
          ogImage: {
            url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1668155873/tutorials/card_2x.png',
          },
        } as any
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="font-heading text-center text-4xl font-black sm:text-5xl lg:text-6xl">
          Free Escuela Frontend Tutorials
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-brand">
          A collection of free, exercise-driven, in-depth Escuela Frontend
          tutorials for you to use on your journey to Escuela Frontend wizardry.
        </p>
        {tutorials && (
          <ul className="flex max-w-screen-md flex-col gap-8 px-3 pt-20">
            {tutorials.map(
              ({title, slug, image, description, exercises}, i) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-xl border border-gray-600  bg-gray-800 shadow-2xl shadow-gray-500/10 md:flex-row"
                  >
                    <div className="flex h-full flex-shrink-0 items-center justify-center bg-gray-700 p-10">
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
                        {exercises.length} exercises
                      </div>
                      <Link
                        href={{
                          pathname: '/tutorials/[module]',
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
                          pathname: '/tutorials/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                      >
                        <a className="group my-4 inline-block gap-2 rounded-full bg-brand px-4 py-2 font-medium text-white transition">
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
