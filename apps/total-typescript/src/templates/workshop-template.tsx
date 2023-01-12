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
import first from 'lodash/first'
import * as Accordion from '@radix-ui/react-accordion'
import {CheckIcon, ChevronDownIcon} from '@heroicons/react/solid'
import {trpc} from 'trpc/trpc.client'
import {find, isArray} from 'lodash'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import PortableTextComponents from '../video/portable-text'

const WorkshopTemplate: React.FC<{
  workshop: SanityDocument
}> = ({workshop}) => {
  const {title, body, ogImage, image, description} = workshop
  const pageTitle = `${title} Workshop`

  return (
    <Layout
      className="mx-auto w-full pt-24 lg:max-w-4xl lg:pb-24"
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
      <Header workshop={workshop} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none px-5 text-white lg:max-w-xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
        <WorkshopSectionNavigator workshop={workshop} />
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{workshop: SanityDocument}> = ({workshop}) => {
  const {title, slug, sections, image, github} = workshop

  const firstSection = first<SanityDocument>(sections)
  const firstExercise = first<SanityDocument>(firstSection?.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pt-0 pb-16 sm:pt-8 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/workshops">
            <a className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Pro Workshop
            </a>
          </Link>
          <h1 className="font-text text-4xl font-bold sm:text-5xl lg:text-6xl">
            {title}
          </h1>
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
            <div className="flex items-center justify-center gap-3 pt-8 md:justify-start">
              {firstSection && (
                <Link
                  href={{
                    pathname: '/workshops/[module]/[section]/[lesson]',
                    query: {
                      module: slug.current,
                      section: firstSection.slug,
                      lesson: firstExercise?.slug,
                    },
                  }}
                >
                  <a
                    className="flex items-center justify-center rounded bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
                    onClick={() => {
                      track('clicked start learning', {module: slug.current})
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

const WorkshopSectionNavigator: React.FC<{workshop: SanityDocument}> = ({
  workshop,
}) => {
  const {sections} = workshop

  return (
    <nav
      aria-label="workshop navigator"
      className="w-full bg-black/20 px-5 py-8 lg:max-w-xs lg:bg-transparent lg:px-0 lg:py-0"
    >
      {sections && (
        <Accordion.Root type="multiple">
          <div className="flex w-full items-center justify-between pb-3">
            <h2 className="text-2xl font-semibold">Contents</h2>
            <h3 className="font-mono text-sm font-semibold uppercase text-gray-300">
              {sections?.length || 0} Sections
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {sections.map((section: SanityDocument, i: number) => {
              return (
                <li key={section.slug}>
                  <Accordion.Item value={section.slug}>
                    <Accordion.Header className="relative z-10 rounded-lg bg-gray-900">
                      <Accordion.Trigger className="group flex w-full items-center justify-between rounded-lg border border-white/5 bg-gray-800/20 py-2 px-3 text-lg font-medium shadow-lg transition hover:bg-gray-800/40">
                        {section.title}
                        <div className="flex items-center">
                          <ChevronDownIcon
                            className="relative h-3 w-3 opacity-70 transition group-hover:opacity-100 group-radix-state-open:rotate-180"
                            aria-hidden="true"
                          />
                        </div>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <WorkshopSectionExerciseNavigator
                        section={section}
                        moduleSlug={workshop.slug.current}
                      />
                    </Accordion.Content>
                  </Accordion.Item>
                </li>
              )
            })}
          </ul>
        </Accordion.Root>
      )}
    </nav>
  )
}

const LessonListItem = ({
  lessonResource,
  section,
  moduleSlug,
  index,
}: {
  lessonResource: LessonResource
  section: SanityDocument
  moduleSlug: string
  index: number
}) => {
  const {data: solution} = trpc.solutions.getSolution.useQuery({
    exerciseSlug: lessonResource.slug,
  })
  const {data: userProgress} = trpc.progress.get.useQuery()

  const isExerciseCompleted =
    isArray(userProgress) && lessonResource._type === 'exercise'
      ? find(userProgress, ({lessonSlug}) => lessonSlug === solution?.slug)
      : find(userProgress, ({lessonSlug}) => lessonSlug === lessonResource.slug)

  return (
    <li key={lessonResource.slug}>
      <Link
        href={{
          pathname: '/workshops/[module]/[section]/[lesson]',
          query: {
            section: section.slug,
            lesson: lessonResource.slug,
            module: moduleSlug,
          },
        }}
        passHref
      >
        <a
          className="group inline-flex items-center py-2.5 text-base font-medium"
          onClick={() => {
            track('clicked workshop exercise', {
              module: moduleSlug,
              lesson: lessonResource.slug,
              section: section.slug,
              moduleType: section._type,
              lessonType: lessonResource._type,
            })
          }}
        >
          {isExerciseCompleted ? (
            <CheckIcon
              className="mr-2 h-4 w-4 text-teal-400"
              aria-hidden="true"
            />
          ) : (
            <span
              className="w-6 font-mono text-xs text-gray-400"
              aria-hidden="true"
            >
              {index + 1}
            </span>
          )}
          <span className="w-full cursor-pointer leading-tight group-hover:underline">
            {lessonResource.title}
          </span>
        </a>
      </Link>
    </li>
  )
}

const WorkshopSectionExerciseNavigator: React.FC<{
  section: SanityDocument
  moduleSlug: string
}> = ({section, moduleSlug}) => {
  const {lessons} = section

  return lessons ? (
    <ul className="-mt-5 rounded-b-lg border border-white/5 bg-black/20 pl-3.5 pr-3 pt-7 pb-3">
      {lessons.map((exercise: LessonResource, i: number) => {
        return (
          <LessonListItem
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            moduleSlug={moduleSlug}
            index={i}
          />
        )
      })}
    </ul>
  ) : null
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
