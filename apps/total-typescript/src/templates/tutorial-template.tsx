import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import {useLearnerCertificateAsOgImage} from 'hooks/use-learner-certificate-as-ogimage'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {isBrowser} from 'utils/is-browser'
import {Subscriber} from 'lib/convertkit'
import {track} from '../utils/analytics'

const TutorialTemplate: React.FC<{
  tutorial: SanityDocument
  subscriber: Subscriber
}> = ({tutorial, subscriber}) => {
  const {title, body, ogImage, image, description} = tutorial
  const pageTitle = `${title} Tutorial`
  const subscriberName =
    subscriber &&
    `${subscriber.first_name} ${subscriber.fields.last_name ?? ''}`
  const certificateUrl = useLearnerCertificateAsOgImage(
    pageTitle,
    image,
    subscriberName,
  )
  const pageOgImageUrl = certificateUrl ?? ogImage ?? undefined

  return (
    <Layout
      className="max-w-4xl mx-auto w-full py-24 px-5 "
      meta={{
        title: certificateUrl
          ? `${subscriberName} has finished the ${pageTitle}`
          : pageTitle,
        description,
        ogImage: {
          url: pageOgImageUrl,
          alt: pageTitle,
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header tutorial={tutorial} />
      <main className="relative z-10 flex lg:flex-row flex-col gap-5">
        <article className="prose prose-lg lg:max-w-xl max-w-none text-white">
          <PortableText value={body} />
        </article>
        <TutorialExerciseNavigator tutorial={tutorial} />
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, slug, exercises, image, github} = tutorial

  return (
    <>
      <header className="relative z-10 sm:pt-8 sm:pb-8 pt-0 pb-16 flex md:flex-row flex-col-reverse items-center justify-between">
        <div className="md:text-left text-center">
          <Link href="/tutorials">
            <a className="uppercase text-sm font-mono font-semibold tracking-wide pb-1 text-cyan-300">
              Tutorial
            </a>
          </Link>
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
                  pathname: '/tutorials/[module]/[exercise]',
                  query: {
                    module: slug.current,
                    exercise: exercises[0].slug.current,
                  },
                }}
              >
                <a
                  className="px-6 py-3 rounded hover:bg-cyan-300 transition flex items-center justify-center font-semibold bg-cyan-400 text-black"
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                >
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
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
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
            width={500}
            height={500}
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
    </>
  )
}

const TutorialExerciseNavigator: React.FC<{tutorial: SanityDocument}> = ({
  tutorial,
}) => {
  const {slug, exercises, _type} = tutorial
  return (
    <nav
      aria-label="exercise navigator"
      className="lg:border-l border-gray-800 lg:pl-8"
    >
      <h2 className="pb-4 text-gray-300 text-sm font-semibold font-mono uppercase">
        {exercises.length} Exercises
      </h2>
      {exercises && (
        <ul>
          {exercises.map((exercise: SanityDocument, i: number) => {
            return (
              <li key={exercise.slug.current}>
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[exercise]',
                    query: {
                      module: slug.current,
                      exercise: exercise.slug.current,
                    },
                  }}
                  passHref
                >
                  <a
                    className="text-lg py-2.5 font-semibold group inline-flex items-center"
                    onClick={() => {
                      track('clicked tutorial exercise', {
                        module: slug.current,
                        lesson: exercise.slug.current,
                        moduleType: _type,
                        lessonType: exercise._type,
                      })
                    }}
                  >
                    <span
                      className="w-8 font-mono text-gray-400 text-xs"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="w-full group-hover:underline leading-tight">
                      {exercise.label}
                    </span>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <CourseJsonLd
    courseName={title}
    description={description}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)
