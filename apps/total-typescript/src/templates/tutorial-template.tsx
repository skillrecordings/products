import React from 'react'
import Layout from 'components/app/layout'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {IconGithub} from 'components/icons'

const TutorialTemplate: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, body, slug, resources, image, ogImage, github} = tutorial
  const pageTitle = `${title} Tutorial`
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <Layout
      className="max-w-screen-md mx-auto w-full py-24 px-5 "
      meta={{title: pageTitle, ...shareCard}}
    >
      <header className="relative z-10 sm:pt-8 sm:pb-8 pt-0 pb-16 flex md:flex-row flex-col-reverse items-center justify-between">
        <div className="md:text-left text-center">
          <p className="uppercase text-sm font-mono font-semibold tracking-wide pb-1 text-cyan-300">
            Tutorial
          </p>
          <h1 className="lg:text-6xl text-5xl font-text font-bold">{title}</h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center md:justify-start justify-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full overflow-hidden">
                  <Image
                    src={require('../../public/matt-pocock.jpeg')}
                    alt="Matt Pocock"
                    width={48}
                    height={48}
                  />
                </div>
                <span>Matt Pocock</span>
              </div>
            </div>
            <div className="pt-8 flex items-center gap-3">
              <Link
                href={{
                  pathname: '/tutorials/[module]/[lesson]',
                  query: {module: slug, lesson: resources[0].slug},
                }}
              >
                <a className="px-6 py-3 rounded hover:bg-cyan-300 transition flex items-center justify-center font-semibold bg-cyan-400 text-black">
                  Start Learning{' '}
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </a>
              </Link>
              {github && (
                <a
                  className="px-5 py-3 gap-2 rounded transition flex items-center justify-center font-medium border-2 border-gray-800 hover:bg-gray-800"
                  href={`https://github.com/total-typescript/${github.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconGithub className="w-6" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center lg:-mr-16">
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            quality={100}
          />
        </div>
      </header>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="object-contain -z-10"
      />
      <main className="relative z-10 flex lg:flex-row flex-col gap-16">
        <article className="prose prose-lg text-white">
          <PortableText value={body} />
        </article>
        <nav className="lg:border-l border-gray-800 lg:pl-10">
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
