import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from 'trpc/trpc.client'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Skeleton} from '@skillrecordings/ui'

const TutorialTemplate: React.FC<{
  tutorial: Module
  tutorialBodySerialized: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBodySerialized}) => {
  const {title, ogImage, description, testimonials} = tutorial
  const pageTitle = `${title} Tutorial`
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: tutorial.slug.current,
    })

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg pt-10 sm:pt-24 lg:pb-24"
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
        <div className="px-5">
          <article className="prose prose-lg w-full max-w-none dark:prose-invert lg:max-w-xl">
            <MDX contents={tutorialBodySerialized} />
          </article>
          {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
        </div>
        <div className="w-full px-5 lg:max-w-xs lg:px-0">
          {tutorial && (
            <Collection.Root module={tutorial}>
              <div className="flex w-full items-center justify-between pb-3">
                <h3 className="text-xl font-bold">Contents</h3>
                <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
              </div>
              <Collection.Sections>
                {moduleProgressStatus === 'success' ? (
                  <Collection.Section className="border border-transparent shadow-xl shadow-gray-300/20 transition hover:brightness-100 dark:border-white/5 dark:shadow-none dark:hover:brightness-125">
                    <Collection.Lessons>
                      <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>[data-check-icon]]:text-red-500 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300" />
                    </Collection.Lessons>
                  </Collection.Section>
                ) : (
                  <Skeleton className="border bg-background py-6" />
                )}
              </Collection.Sections>
              {/* Used if module has either none or single section so they can be styled differently */}
              <Collection.Lessons>
                {moduleProgressStatus === 'success' ? (
                  <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>[data-check-icon]]:text-red-500 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300" />
                ) : (
                  <Skeleton className="my-2 border bg-background py-5" />
                )}
              </Collection.Lessons>
            </Collection.Root>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: Module}> = ({tutorial}) => {
  const {title, slug, sections, image, github} = tutorial
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: tutorial.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || tutorial.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pb-10 pt-8 sm:pb-16 sm:pt-12 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/tutorials"
            className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-rose-500 dark:text-rose-400"
          >
            Free Tutorial
          </Link>
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-900">
                  <Image
                    src={require('../../public/kent-c-dodds.png')}
                    alt="Kent C. Dodds"
                    width={48}
                    height={48}
                    priority
                    placeholder="blur"
                  />
                </div>
                <span>Kent C. Dodds</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              <Link
                href={
                  firstSection && sections
                    ? {
                        pathname: '/tutorials/[module]/[section]/[lesson]',
                        query: {
                          module: slug.current,
                          section: isModuleInProgress
                            ? nextSection?.slug
                            : firstSection.slug,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                    : {
                        pathname: '/tutorials/[module]/[lesson]',
                        query: {
                          module: slug.current,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                }
                className={cx(
                  'relative flex w-full items-center justify-center rounded-md bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-4 text-lg font-semibold text-white transition hover:brightness-110 focus-visible:ring-white md:max-w-[240px]',
                  {
                    'animate-pulse': moduleProgressStatus === 'loading',
                  },
                )}
                onClick={() => {
                  track('clicked start learning', {module: slug.current})
                }}
              >
                {isModuleInProgress ? 'Continue' : 'Start'} Learning
                <span className="pl-2" aria-hidden="true">
                  →
                </span>
              </Link>
              {github?.repo && (
                <a
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-4 font-medium leading-tight transition hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 md:w-auto"
                  href={github.repo}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" size="24" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0 lg:-mr-5">
            <Image
              priority
              src={image}
              alt={title}
              width={360}
              height={360}
              quality={100}
            />
          </div>
        )}
      </header>
    </>
  )
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description?: string | null | undefined
}) => (
  <CourseJsonLd
    courseName={title}
    description={description || ''}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)
