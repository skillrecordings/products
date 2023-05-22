import {Suspense} from 'react'
import * as React from 'react'
import {getAllTips} from '@/lib/tips'
import {Concept, getAllConcepts} from '@/lib/concepts'
import Link from 'next/link'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

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
      <ul>
        {concepts.map((concept: Concept) => (
          <li key={concept.slug.current}>
            <h2 className="text-base font-medium leading-tight sm:text-xl">
              <Link
                href={{
                  pathname: '/concepts/[slug]',
                  query: {
                    slug: concept.slug.current,
                  },
                }}
                className="w-full gap-1 hover:underline"
              >
                <Balancer>{concept.title}</Balancer>
              </Link>
            </h2>
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
        title: 'TypeScript Tips by Matt Pocock',
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1663921088/tips/card_2x_b9zrcx.png',
          alt: 'TypeScript Tips by Matt Pocock',
        },
      }}
      className="flex flex-col items-center pb-24"
    >
      <header className="relative z-10 flex flex-col items-center pb-16 pt-28 text-center sm:pt-32 lg:pb-24 lg:pt-40">
        <h1 className="text-center font-heading text-4xl font-bold sm:text-5xl">
          TypeScript Concepts
        </h1>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-screen-md flex-col px-3 sm:px-5">
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
