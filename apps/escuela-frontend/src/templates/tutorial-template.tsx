import React from 'react'
import Layout from '../components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from '../components/icons'
import {isBrowser} from '../utils/is-browser'
import {Exercise} from '../lib/exercises'
import PortableTextComponents from '../components/portable-text'
import first from 'lodash/first'

const TutorialTemplate: React.FC<{
  tutorial: SanityDocument
}> = ({tutorial}) => {
  const {title, body, ogImage, image, description} = tutorial
  const pageTitle = `${title} Tutorial`

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg py-20 px-5 lg:px-0"
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
        <article className="prose prose-lg -mt-8 w-full max-w-none text-white lg:max-w-2xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
        <TutorialExerciseNavigator tutorial={tutorial} />
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, slug, sections, image, github} = tutorial

  const firstSection = first<SanityDocument>(sections)
  const firstExercise = first<SanityDocument>(firstSection?.exercises)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between gap-20 pt-0 pb-20 sm:pt-8 sm:pb-10 md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/tutoriales">
            <a className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-brand">
              Tutorial
            </a>
          </Link>
          <h1 className="font-text text-5xl font-bold lg:text-6xl">{title}</h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <span>Matt Pocock</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-8 md:justify-start">
              {firstSection && (
                <Link
                  href={{
                    pathname: '/tutoriales/[module]/[section]/[exercise]',
                    query: {
                      module: slug.current,
                      section: firstSection.slug,
                      exercise: firstExercise?.slug,
                    },
                  }}
                >
                  <a className="flex items-center justify-center rounded border border-gray-50 bg-gray-50  px-6 py-3 text-base font-semibold text-gray-900 transition hover:border-gray-50 hover:bg-gray-900 hover:text-gray-50">
                    Start Learning{' '}
                    <span className="pl-2" aria-hidden="true">
                      →
                    </span>
                  </a>
                </Link>
              )}
              {github && (
                <a
                  className="flex items-center justify-center gap-2 rounded border border-gray-700 bg-gray-900 px-4 py-3 text-base text-gray-300 transition hover:border-gray-50 hover:text-gray-50"
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
        {image && (
          <div className="flex items-center justify-center p-10 lg:-mr-16">
            <Image
              src={image}
              alt={title}
              width={300}
              height={300}
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
  const {slug, sections, _type} = tutorial
  return (
    <nav
      aria-label="exercise navigator"
      className="border-gray-700 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-300">
        {sections?.length || 0} Sections
      </h2>
      {sections && (
        <ul>
          {sections.map((section: SanityDocument, i: number) => {
            return (
              <li key={section.slug}>
                <div className="group inline-flex items-center py-2.5 text-lg font-semibold">
                  <span
                    className="w-8 font-mono text-xs text-gray-400"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="w-full leading-tight">{section.title}</span>
                </div>
                <TutorialSectionExerciseNavigator
                  section={section}
                  moduleSlug={tutorial.slug.current}
                />
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}

const TutorialSectionExerciseNavigator: React.FC<{
  section: SanityDocument
  moduleSlug: string
}> = ({section, moduleSlug}) => {
  const {slug, exercises, _type} = section
  return (
    <nav
      aria-label="exercise navigator"
      className="border-gray-700 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-300">
        {exercises?.length || 0} Exercises
      </h2>
      {exercises && (
        <ul>
          {exercises.map((exercise: Exercise, i: number) => {
            return (
              <li key={exercise.slug}>
                <Link
                  href={{
                    pathname: '/tutoriales/[module]/[section]/[exercise]',
                    query: {
                      section: slug,
                      exercise: exercise.slug,
                      module: moduleSlug,
                    },
                  }}
                  passHref
                >
                  <a className="group inline-flex items-center py-2.5 text-lg font-semibold">
                    <span
                      className="w-8 font-mono text-xs text-gray-400"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="w-full cursor-pointer leading-tight group-hover:underline">
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
