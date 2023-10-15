import Layout from 'components/app/layout'
import {Variants, motion, useAnimation, useReducedMotion} from 'framer-motion'
import drop from 'lodash/drop'
import Image from 'next/legacy/image'
import ReactMarkdown from 'react-markdown'
import {team, instructor, description} from 'components/credits'
import cx from 'classnames'
import {XIconTwitter} from 'components/x-icon'
import {HomeIcon} from '@heroicons/react/outline'
import Balancer from 'react-wrap-balancer'
import {useTheme} from 'next-themes'
import React from 'react'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {GetStaticProps} from 'next'
import {random, reverse, shuffle} from 'lodash'
import {cn} from '@skillrecordings/ui/utils/cn'

export const getStaticProps: GetStaticProps = async () => {
  const lessons =
    await sanityClient.fetch(groq`*[_type == "lesson"] | order(_createdAt asc) {
    "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
  }[0...25]`)

  return {
    props: {lessons},
  }
}

const Credits: React.FC<any> = ({lessons}) => {
  return (
    <Layout
      meta={{
        title: 'Humans behind Epic Web',
        description,
        ogImage: {url: ''},
      }}
    >
      <div className="relative bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground">
        <Header lessons={lessons} />
      </div>
      <main>
        <div className="mx-auto -mt-40 flex w-full max-w-screen-md flex-col gap-10 px-5 pb-24 sm:-mt-80 sm:gap-16 lg:gap-24">
          {instructor && <Instructor />}
          <Team />
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const Team = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <>
      {drop(team).map(
        ({name, role, description, image, xHandle, website}, i) => {
          return (
            <motion.article
              whileInView={!shouldReduceMotion ? {scale: 1, opacity: 1} : {}}
              initial={!shouldReduceMotion ? {scale: 0.9, opacity: 0} : {}}
              transition={{
                duration: 0.5,
                ease: [0.48, 0.15, 0.25, 0.96],
                delay: i * 0.1,
              }}
              key={name}
              className={cx(
                'flex flex-col items-center gap-5 pb-10 sm:gap-16 sm:pb-0',
                {
                  'md:flex-row-reverse': i % 2 === 0,
                  'md:flex-row': i % 1 === 0,
                },
              )}
            >
              <div className="flex flex-shrink-0 items-center">
                <Image
                  src={image}
                  alt={name}
                  width={280}
                  height={280}
                  quality={100}
                  className="rounded-lg"
                  placeholder="blur"
                />
              </div>
              <div className="w-full pt-5 text-center md:text-left">
                <h2 className=" text-3xl font-bold">{name}</h2>
                <h3 className="pt-2 font-mono text-xs font-semibold uppercase opacity-75">
                  {role}
                </h3>
                {description && (
                  <ReactMarkdown
                    components={{
                      p: ({children, ...props}) => {
                        return (
                          <p {...props}>
                            <Balancer>{children}</Balancer>
                          </p>
                        )
                      },
                    }}
                    className="prose max-w-lg pt-4 dark:prose-invert"
                  >
                    {description}
                  </ReactMarkdown>
                )}
                <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
                  <a
                    href={`https://twitter.com/${xHandle}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
                    <XIconTwitter className="h-3 w-3" />
                  </a>
                  {website && (
                    <a
                      href={website}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex items-center justify-center gap-1 rounded py-1.5 font-mono text-xs text-primary hover:underline"
                    >
                      {extractDomainWithPath(website)}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          )
        },
      )}
    </>
  )
}

const Instructor = () => {
  return (
    <article className="relative">
      <div className="pointer-events-none flex flex-shrink-0 items-center justify-center">
        {instructor?.image && (
          <div className=" w-72 sm:w-auto">
            <Image
              src={instructor.image}
              alt={instructor.name}
              width={500}
              height={500}
              quality={100}
              placeholder="blur"
              priority
            />
          </div>
        )}
      </div>
      <div className="pt-10">
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
          {instructor?.name}
        </h2>
        <h3 className="pt-2 font-mono text-sm font-medium uppercase opacity-75">
          {instructor?.role}
        </h3>
        {instructor?.description && (
          <ReactMarkdown className="prose pt-4 dark:prose-invert sm:prose-lg">
            {instructor.description}
          </ReactMarkdown>
        )}
        <div className="mt-5 flex items-center gap-3">
          {instructor?.xHandle && (
            <a
              href={`https://twitter.com/${instructor.xHandle}`}
              rel="noopener noreferrer"
              target="_blank"
              className="flex h-8 w-8 items-center justify-center rounded-full border"
            >
              <XIconTwitter className="h-3 w-3" />
            </a>
          )}
          {instructor?.website && (
            <a
              href={instructor.website}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center justify-center gap-1 rounded py-1.5 font-mono text-sm text-primary hover:underline"
            >
              {extractDomainWithPath(instructor.website)}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const Header: React.FC<any> = ({lessons}) => {
  return (
    <header className="  overflow-hidden pt-24">
      <div className=" z-30 mx-auto flex w-full flex-col items-center justify-center gap-5">
        <div className="flex w-full max-w-screen-lg flex-col items-center px-5 text-center">
          <h1 className="w-full text-2xl font-bold sm:text-3xl lg:text-4xl">
            <Balancer>Humans Behind Epic Web</Balancer>
          </h1>
          <div className="max-w-xl pt-5 leading-relaxed opacity-90">
            <Balancer>
              Bringing Epic Web to you is a collaboration between Kent C. Dodds
              and the team behind{' '}
              <a
                href="https://badass.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                bada**.dev
              </a>
              . Kent created, designed and recorded all the content, while the
              rest of the team provided planning, design, development, and
              delivery support.
            </Balancer>
          </div>
          <Badge className="mt-10" />
        </div>
        <Thumbnails lessons={lessons} />
      </div>
    </header>
  )
}

function extractDomainWithPath(url: string) {
  // Use a regular expression to match the domain along with the path
  const domainMatch = url.match(/:\/\/(www[0-9]?\.)?([^/]+)(\/[^]*)?/)

  if (domainMatch) {
    // Extract the matched domain and path
    const domainWithPath = domainMatch[2] + (domainMatch[3] || '')

    return domainWithPath
  }

  return url // Return the original URL if no domain found
}

const Thumbnails: React.FC<any> = ({lessons}) => {
  const w = 384
  const h = 217
  const shouldReduceMotion = useReducedMotion()
  return (
    <div
      className="relative mt-16 flex items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="grid h-full w-full grid-cols-5 gap-3"
        style={{
          rotateX: '7deg',
          scale: 1,
          transformOrigin: 'center top',
          transformPerspective: 300,
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {shuffle(lessons).map((lesson: any, i: number) => (
          <motion.img
            key={lesson.muxPlaybackId}
            whileHover={
              !shouldReduceMotion
                ? {
                    y: -5,
                    scale: 1.05,
                  }
                : {}
            }
            className="rounded-md shadow-2xl"
            transition={{
              duration: 0.5,
              ease: [0.48, 0.15, 0.25, 0.96],
            }}
            src={`https://image.mux.com/${lesson.muxPlaybackId}/thumbnail.png?time=0&width=${w}&height=${h}`}
            width={w}
            height={h}
            aria-hidden
          />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-primary to-transparent" />
    </div>
  )
}

const Badge: React.FC<{className?: string}> = ({className}) => {
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <>
      {' '}
      {mounted ? (
        <a
          href="https://badass.dev"
          target="_blank"
          rel="noopener noreferrer"
          className={cn('mt-5', className)}
        >
          <Image
            src={
              theme === 'light'
                ? require('../../public/credits/badass-badge-censored-light.svg')
                : require('../../public/credits/badass-badge-censored-dark.svg')
            }
            alt="Powered by Badass.dev"
            width={186 / 1.2}
            height={56 / 1.2}
          />
        </a>
      ) : null}
    </>
  )
}
