import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from '@/trpc/trpc.client'
import {capitalize, first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Skeleton} from '@skillrecordings/ui'
import {CogIcon} from '@heroicons/react/outline'
import {WorkshopAppBanner} from '@/components/workshop-app'
import {lessonPathBuilder} from '@/utils/lesson-path-builder'
import {MdOutlineRocketLaunch} from 'react-icons/md'

const TutorialTemplate: React.FC<{
  tutorial: any
  tutorialBodySerialized: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBodySerialized}) => {
  const {title, ogImage, description} = tutorial
  const pageTitle = `${title} Tutorial`

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: tutorial.slug.current,
    })

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg lg:pb-24"
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
      {tutorial.state === 'draft' && (
        <div className="sm:px-3">
          <div className="mt-2 flex w-full items-center justify-center gap-2 bg-orange-500/10 px-5 py-3 text-sm leading-tight text-amber-600 dark:bg-orange-400/10 dark:text-orange-300 sm:mt-0 sm:rounded sm:text-base">
            <CogIcon className="h-4 w-4" /> {capitalize(tutorial.moduleType)}{' '}
            under development — you're viewing a draft version.
          </div>
        </div>
      )}
      <Header tutorial={tutorial} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <div className="w-full px-5">
          <article className="prose prose-lg w-full max-w-none dark:prose-invert lg:max-w-xl">
            <MDX
              contents={tutorialBodySerialized}
              components={{
                Callout: ({children, ctaLink}) => {
                  return (
                    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 pb-4 shadow-sm dark:bg-gray-700">
                      <div className="flex space-x-3">
                        <span className="flex-shrink-0 pt-5 text-blue-500">
                          <MdOutlineRocketLaunch className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <div>
                            <p className="text-base font-medium leading-none text-blue-700 dark:text-white">
                              {children}
                            </p>
                          </div>
                          {ctaLink && (
                            <Link
                              href={ctaLink}
                              className="block text-base font-semibold text-blue-500 no-underline hover:text-blue-800"
                            >
                              To Continue Learning Go Pro →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                },
              }}
            />
          </article>
        </div>
        <div className="w-full px-5 lg:max-w-sm xl:px-0">
          {tutorial && (
            <Collection.Root
              module={tutorial}
              lessonPathBuilder={lessonPathBuilder}
            >
              <div className="flex w-full items-center justify-between pb-3">
                {(tutorial.lessons || tutorial.sections) && (
                  <h3 className="text-xl font-bold">Contents</h3>
                )}
                <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
              </div>
              <Collection.Sections className="space-y-0 rounded-md border border-er-gray-200 bg-er-gray-100 [&_[data-state]]:animate-none">
                {moduleProgressStatus === 'success' ? (
                  <Collection.Section className="border-er-gray-200 bg-transparent font-semibold leading-tight transition data-[state='open']:rounded-none data-[state]:rounded-none data-[state='closed']:border-b hover:bg-er-gray-300 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-emerald-600 dark:[&>[data-check-icon]]:text-emerald-600 [&>[data-progress='100']]:bg-transparent [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-emerald-500 [&_[data-progress]]:dark:bg-emerald-400">
                    <Collection.Lessons className="border-none bg-transparent py-0">
                      <Collection.Lesson className='pl-4 transition before:hidden data-[active="true"]:bg-white hover:bg-er-gray-300 dark:data-[active="true"]:bg-er-gray-200 dark:hover:data-[active="true"]:bg-er-gray-300 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-emerald-600 [&_[data-check-icon]]:opacity-100 dark:[&_[data-check-icon]]:text-emerald-600 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:transition [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
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
          <WorkshopAppBanner
            moduleSlug={tutorial.slug.current || ''}
            className="mt-3 rounded-lg border p-5"
          />
        </div>
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: any}> = ({tutorial}) => {
  const {title, slug, sections, image, github, instructor} = tutorial
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
            className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400 "
          >
            Free Tutorial
          </Link>
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start"></div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              {(tutorial.lessons || tutorial.sections) && (
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: isModuleInProgress
                        ? nextLesson?.slug
                        : firstLesson?.slug,
                    },
                  }}
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
              )}
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
