import {Suspense} from 'react'
import * as React from 'react'
import {getAllTips} from '@/lib/tips'
import {Concept, getAllConcepts} from '@/lib/concepts'
import Link from 'next/link'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'

export async function getStaticProps() {
  const concepts = await getAllConcepts()

  return {
    props: {concepts},
    revalidate: 10,
  }
}
const ConceptList = ({concepts}: {concepts: Concept[]}) => {
  return (
    <>
      <ul className="flex flex-col divide-y divide-gray-800/75">
        {concepts
          .filter((concept: Concept) => concept.body)
          .map((concept: Concept) => (
            <li key={concept.slug.current}>
              <Link
                href={{
                  pathname: '/concepts/[slug]',
                  query: {
                    slug: concept.slug.current,
                  },
                }}
                className="group inline-flex w-full items-center justify-between px-5 py-4 transition hover:bg-gray-500/5"
              >
                <h2 className="w-full text-base font-medium leading-tight sm:text-xl">
                  <ReactMarkdown>{concept.title}</ReactMarkdown>
                </h2>
                <div
                  aria-hidden="true"
                  className="-translate-x-5 text-gray-400 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </>
  )
}

const pageDescription = 'A collection of TypeScript Concepts.'

export default function ConceptsIndex({concepts}: {concepts: Concept[]}) {
  return (
    <Layout
      meta={{
        title: 'TypeScript Concepts by Matt Pocock',
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1684835626/concepts-card_2x_qqrc5r.png',
          alt: 'TypeScript Concepts by Matt Pocock',
        },
      }}
      className="flex min-h-full flex-col items-center pb-24"
    >
      <header className="relative z-10 flex flex-col items-center pb-16 pt-28 text-center sm:pt-32 lg:pb-24 lg:pt-40">
        <h1 className="text-center font-heading text-2xl font-medium text-cyan-300 sm:text-3xl">
          TypeScript{' '}
          <span className="-mt-2 block text-5xl font-bold text-white sm:text-6xl">
            Concepts
          </span>
        </h1>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-col sm:px-5">
        <ConceptList concepts={concepts} />
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}
