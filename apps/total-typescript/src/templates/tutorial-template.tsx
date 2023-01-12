import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import PortableTextComponents from 'video/portable-text'

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
      className="mx-auto w-full max-w-4xl py-24 px-5 "
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
        <article className="prose prose-lg w-full max-w-none text-white lg:max-w-xl">
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
      <header className="relative z-10 flex flex-col-reverse items-center justify-between pt-0 pb-16 sm:pt-8 sm:pb-8 md:flex-row">
        <div className="pt-5 text-center sm:pt-0 md:text-left">
          <Link href="/tutorials">
            <a className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Tutorial
            </a>
          </Link>
          <h1 className="font-text text-5xl font-bold lg:text-6xl">{title}</h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
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
                >
                  <a
                    className="flex items-center justify-center rounded bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
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
              )}
              {github?.repo && (
                <a
                  className="flex items-center justify-center gap-2 rounded border-2 border-gray-800 px-5 py-3 font-medium transition hover:bg-gray-800"
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
        {image && (
          <div className="flex items-center justify-center lg:-mr-16">
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
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
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
      className="border-gray-800 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-300">
        {lessons?.length || 0} Exercises
      </h2>
      {lessons && (
        <ul>
          {lessons.map((exercise: LessonResource, i: number) => {
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
                >
                  <a
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
