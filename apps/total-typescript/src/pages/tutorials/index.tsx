import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {checkIfConvertkitSubscriber} from '@skillrecordings/convertkit'
import Image from 'next/image'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tutorials = await getAllTutorials()
  const hasSubscribed = await checkIfConvertkitSubscriber(context)

  return {
    props: {tutorials},
  }
}

const TutorialsPage: React.FC<{tutorials: SanityDocument[]}> = ({
  tutorials,
}) => {
  return (
    <Layout
      meta={{
        description: `Free TypeScript tutorials by Matt Pocock that will help you learn how to use TypeScript as a professional web developer through exercise driven examples.`,
      }}
    >
      <main className="flex py-32 items-center justify-center flex-col relatiev z-10">
        <h1 className="font-heading sm:text-6xl text-5xl font-bold">
          Tutorials
        </h1>
        {tutorials && (
          <ul className="pt-20 max-w-screen-md flex flex-col gap-8 px-3">
            {tutorials.map(({title, slug, image, description, resources}) => {
              return (
                <li
                  key={slug}
                  className="flex md:flex-row flex-col gap-10 items-center p-10 rounded-lg bg-black/30"
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Image
                      src={image}
                      alt={title}
                      width={300}
                      quality={100}
                      height={300}
                    />
                  </div>
                  <div>
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug,
                        },
                      }}
                    >
                      <a className="sm:text-5xl text-4xl font-semibold hover:underline">
                        {title}
                      </a>
                    </Link>
                    <div className="py-4 text-sm font-mono uppercase">
                      {resources.length} lessons
                    </div>
                    {description && (
                      <p className="text-gray-300">{description}</p>
                    )}
                    <Link
                      href={{
                        pathname: '/tutorials/[module]',
                        query: {
                          module: slug,
                        },
                      }}
                    >
                      <a className="gap-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 transition inline-block mt-5 font-medium">
                        View <span aria-hidden="true">→</span>
                      </a>
                    </Link>
                  </div>
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
        className="object-contain -z-10"
      />
    </Layout>
  )
}

export default TutorialsPage
