import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import cx from 'classnames'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import first from 'lodash/first'
import * as Accordion from '@radix-ui/react-accordion'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid'
import {trpc} from 'trpc/trpc.client'
import {find, isArray, isEmpty} from 'lodash'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import PortableTextComponents from '../video/portable-text'
import {
  useModuleProgress,
  useSectionProgress,
} from '@skillrecordings/skill-lesson/hooks/use-progress'

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
        {workshop && <WorkshopSectionNavigator workshop={workshop} />}
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{workshop: SanityDocument}> = ({workshop}) => {
  const {title, slug, sections, image, github} = workshop
  const moduleProgress = useModuleProgress({
    module: workshop,
  })

  const firstSection = first<SanityDocument>(sections)
  const firstExercise = first<SanityDocument>(firstSection?.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pt-0 pb-16 sm:pt-8 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link
            href="/workshops"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300"
          >
            Pro Workshop
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
                      section:
                        moduleProgress.completedLessons.length > 0
                          ? moduleProgress?.nextSection?.slug
                          : firstSection.slug,
                      lesson:
                        moduleProgress.completedLessons.length > 0
                          ? moduleProgress?.nextExercise?.slug
                          : firstExercise?.slug,
                    },
                  }}
                  className={cx(
                    'flex items-center justify-center rounded bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300',
                    {
                      'animate-pulse': moduleProgress.status === 'loading',
                    },
                  )}
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  {moduleProgress.completedLessons.length > 0
                    ? 'Continue'
                    : 'Start'}{' '}
                  Learning
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
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
  const {nextSection, status: moduleProgressStatus} = useModuleProgress({
    module: workshop,
  })

  const [openedSections, setOpenedSections] = React.useState<string[]>()
  React.useEffect(() => {
    setOpenedSections([nextSection?.slug])
  }, [moduleProgressStatus])
  return (
    <nav
      aria-label="workshop navigator"
      className="w-full bg-black/20 px-5 py-8 lg:max-w-xs lg:bg-transparent lg:px-0 lg:py-0"
    >
      {sections && (
        <Accordion.Root
          type="multiple"
          onValueChange={(e) => setOpenedSections(e)}
          value={moduleProgressStatus === 'success' ? openedSections : []}
        >
          <div className="flex w-full items-center justify-between pb-3">
            <h2 className="text-2xl font-semibold">Contents</h2>
            <h3
              className="cursor-pointer font-mono text-sm font-semibold uppercase text-gray-300"
              onClick={() => {
                setOpenedSections(
                  !isEmpty(openedSections)
                    ? []
                    : sections.map(({slug}: {slug: string}) => slug),
                )
              }}
            >
              {sections?.length || 0} Sections
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {sections.map((section: SanityDocument, i: number) => {
              return <SectionItem section={section} workshop={workshop} />
            })}
          </ul>
        </Accordion.Root>
      )}
    </nav>
  )
}

const SectionItem: React.FC<{
  section: SanityDocument
  workshop: SanityDocument
}> = ({section, workshop}) => {
  const sectionProgress = useSectionProgress({section: section})

  return (
    <li key={section.slug}>
      <Accordion.Item value={section.slug}>
        <Accordion.Header className="relative z-10 overflow-hidden rounded-lg bg-gray-900">
          <Accordion.Trigger className="group relative z-10 flex w-full items-center justify-between rounded-lg border border-white/5 bg-gray-800/20 py-2 px-3 text-lg font-medium shadow-lg transition hover:bg-gray-800/40">
            {section.title}
            <div className="flex items-center">
              {sectionProgress.isCompleted && (
                <CheckIcon
                  className="mr-2 h-4 w-4 text-teal-400"
                  aria-hidden="true"
                />
              )}
              <ChevronDownIcon
                className="relative h-3 w-3 opacity-70 transition group-hover:opacity-100 group-radix-state-open:rotate-180"
                aria-hidden="true"
              />
            </div>
          </Accordion.Trigger>
          <div
            aria-hidden="true"
            className={`absolute left-0 top-0 h-full bg-white/5`}
            style={{width: `${sectionProgress.percentCompleted}%`}}
          />
        </Accordion.Header>
        <Accordion.Content>
          <WorkshopSectionExerciseNavigator
            workshop={workshop}
            section={section}
          />
        </Accordion.Content>
      </Accordion.Item>
    </li>
  )
}

const LessonListItem = ({
  lessonResource,
  section,
  workshop,
  index,
}: {
  lessonResource: LessonResource
  section: SanityDocument
  workshop: SanityDocument
  index: number
}) => {
  const {data: solution} = trpc.solutions.getSolution.useQuery({
    exerciseSlug: lessonResource.slug,
  })
  // const {data: userProgress} = trpc.progress.get.useQuery()
  const {completedLessons, nextExercise} = useModuleProgress({module: workshop})

  const isExerciseCompleted =
    isArray(completedLessons) && lessonResource._type === 'exercise'
      ? find(completedLessons, ({lessonSlug}) => lessonSlug === solution?.slug)
      : find(
          completedLessons,
          ({lessonSlug}) => lessonSlug === lessonResource.slug,
        )
  const isNextExercise = nextExercise?.slug === lessonResource.slug

  return (
    <li key={lessonResource.slug}>
      <Link
        href={{
          pathname: '/workshops/[module]/[section]/[lesson]',
          query: {
            section: section.slug,
            lesson: lessonResource.slug,
            module: workshop.slug.current,
          },
        }}
        passHref
        className={cx(
          'group inline-flex w-full flex-col justify-center py-2.5 pl-3.5 pr-3 text-base font-medium',
          {
            'bg-gradient-to-r from-cyan-300/5 to-transparent': isNextExercise,
          },
        )}
        onClick={() => {
          track('clicked workshop exercise', {
            module: workshop.slug.current,
            lesson: lessonResource.slug,
            section: section.slug,
            moduleType: section._type,
            lessonType: lessonResource._type,
          })
        }}
      >
        {isNextExercise && (
          <div className="flex items-center gap-1 pb-1">
            <ArrowRightIcon
              aria-hidden="true"
              className="mr-1.5 -ml-1 h-4 w-4 text-cyan-300"
            />
            <div className="font-mono text-xs font-semibold uppercase tracking-wide text-cyan-300">
              CONTINUE
            </div>
          </div>
        )}
        <div className="inline-flex items-center">
          {isExerciseCompleted ? (
            <CheckIcon
              className="mr-[11.5px] -ml-1 h-4 w-4 text-teal-400"
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
        </div>
      </Link>
    </li>
  )
}

const WorkshopSectionExerciseNavigator: React.FC<{
  section: SanityDocument
  workshop: SanityDocument
}> = ({section, workshop}) => {
  const {lessons} = section

  return lessons ? (
    <ul className="-mt-5 rounded-b-lg border border-white/5 bg-black/20 pt-7 pb-3">
      {lessons.map((exercise: LessonResource, i: number) => {
        return (
          <LessonListItem
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            workshop={workshop}
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
