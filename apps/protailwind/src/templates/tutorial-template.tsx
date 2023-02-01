import React from 'react'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {isBrowser} from 'utils/is-browser'
import {track} from '../utils/analytics'
import {Exercise} from 'lib/exercises'
import PortableTextComponents from 'video/portable-text'
import Icon from 'components/icons'

const TutorialTemplate: React.FC<{
  tutorial: SanityDocument
}> = ({tutorial}) => {
  const {title, body, ogImage, image, description} = tutorial
  const pageTitle = `${title} Tutorial`

  // TODO: Fix behaving poorly showing the wrong title
  // const {subscriber} = useConvertkit()
  //
  // const subscriberName =
  //   subscriber &&
  //   `${subscriber.first_name} ${subscriber?.fields?.last_name ?? ''}`
  //
  // const certificateUrl = useLearnerCertificateAsOgImage(
  //   pageTitle,
  //   image,
  //   subscriberName,
  // )
  //
  // const pageOgImageUrl = certificateUrl ?? ogImage ?? undefined

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg py-24 px-5"
      meta={{
        title: pageTitle,
        description,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header tutorial={tutorial} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
        <TutorialExerciseNavigator tutorial={tutorial} />
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, slug, lessons, image, github} = tutorial

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between pb-16 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link
            href="/tutorials"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-brand-red"
          >
            Free Tutorial
          </Link>
          <h1 className="font-text max-w-4xl pt-5 font-heading text-4xl font-black lg:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/assets/simon-vrachliotis.png')}
                    alt="Simon Vrachliotis"
                    width={48}
                    height={48}
                  />
                </div>
                <span>Simon Vrachliotis</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-8">
              {lessons?.[0] && (
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: lessons[0].slug,
                    },
                  }}
                  className="flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white transition hover:brightness-125"
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                >
                  Start Learning{' '}
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {github?.repo && (
                <a
                  className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  href={`https://github.com/pro-tailwind/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" className="h-5 w-5" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              quality={100}
            />
          </div>
        )}
      </header>
    </>
  )
}

const TutorialExerciseNavigator: React.FC<{tutorial: SanityDocument}> = ({
  tutorial,
}) => {
  const {slug, lessons, _type} = tutorial
  return (
    <nav
      aria-label="exercise navigator"
      className="border-gray-200 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-600">
        {lessons?.length || 0} Exercises
      </h2>
      {lessons && (
        <ul>
          {lessons.map((exercise: Exercise, i: number) => {
            return (
              <li key={exercise.slug}>
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: exercise.slug,
                    },
                  }}
                  passHref
                  className="group inline-flex items-center py-2.5 text-lg font-semibold"
                  onClick={() => {
                    track('clicked tutorial exercise', {
                      module: slug.current,
                      lesson: exercise.slug,
                      moduleType: _type,
                      lessonType: exercise._type,
                    })
                  }}
                >
                  <span
                    className="w-8 font-mono text-xs text-gray-400"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="w-full leading-tight group-hover:underline">
                    {exercise.title}
                  </span>
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
