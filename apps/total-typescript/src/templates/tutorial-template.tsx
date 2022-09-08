import React from 'react'
import Layout from 'components/app/layout'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {first} from 'lodash'

const TutorialTemplate: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, body, slug, resources, image, ogImage} = tutorial
  const pageTitle = `${title} Tutorial`
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <Layout
      className="max-w-screen-md mx-auto w-full py-24 px-5"
      meta={{title: pageTitle, ...shareCard}}
    >
      <header className="sm:pt-8 sm:pb-8 pt-0 pb-16 flex md:flex-row flex-col-reverse items-center justify-between">
        <div className="md:text-left text-center">
          <p className="uppercase text-sm font-mono font-semibold tracking-wide pb-1 text-cyan-300">
            Tutorial
          </p>
          <h1 className="lg:text-6xl text-5xl font-text font-bold">{title}</h1>
          <div className="pt-8 text-lg">
            <Link
              href={{
                pathname: '/tutorials/[module]/[lesson]',
                query: {module: slug, lesson: resources[0].slug},
              }}
            >
              <a className="px-5 py-3 rounded hover:bg-cyan-300 transition flex items-center justify-center font-semibold bg-cyan-400 text-black">
                Start Learning
              </a>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center lg:-mr-16">
          <Image src={image} alt={title} width={400} height={400} />
        </div>
      </header>
      <main className="flex lg:flex-row flex-col gap-16">
        <article className="prose prose-lg text-white">
          <PortableText value={body} />
        </article>
        <nav className="border-l border-gray-800 pl-10">
          <h2 className="pb-4 text-gray-300 text-sm font-semibold font-mono uppercase">
            Lessons
          </h2>
          {resources && (
            <ul>
              {resources.map((resource: SanityDocument, i: number) => (
                <li key={resource.slug}>
                  <Link
                    href={{
                      pathname: '/tutorials/[module]/[lesson]',
                      query: {module: slug, lesson: resource.slug},
                    }}
                    passHref
                  >
                    <a className="text-lg py-2.5 font-semibold group inline-flex items-center">
                      <span
                        className="w-8 font-mono text-gray-400 text-xs"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="w-full group-hover:underline leading-tight">
                        {resource.title}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </main>
    </Layout>
  )
}

export default TutorialTemplate
