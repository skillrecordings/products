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

import cx from 'classnames'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Skeleton} from '@skillrecordings/ui'
import {CogIcon} from '@heroicons/react/outline'
import {WorkshopAppBanner} from '@/components/workshop-app'
import {type Bonus} from '@/lib/bonuses'
import {lessonPathBuilder} from '@/utils/lesson-path-builder'
import {MdOutlineRocketLaunch} from 'react-icons/md'
import {getOgImage} from '@/utils/get-og-image'

const BonusTemplate: React.FC<{
  bonus: Bonus
  bonusBodySerialized: MDXRemoteSerializeResult
}> = ({bonus, bonusBodySerialized}) => {
  const {title, description, moduleType} = bonus

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: bonus.slug.current,
    })

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg lg:pb-24"
      meta={{
        title: title,
        description,
        ogImage: getOgImage({
          title: title,
        }),
      }}
    >
      <CourseMeta title={title} description={description} />
      {bonus.state === 'draft' && (
        <div className="sm:px-3">
          <div className="mt-2 flex w-full items-center justify-center gap-2 bg-orange-500/10 px-5 py-3 text-sm leading-tight text-amber-600 dark:bg-orange-400/10 dark:text-orange-300 sm:mt-0 sm:rounded sm:text-base">
            <CogIcon className="h-4 w-4" /> {capitalize(moduleType)} under
            development — you're viewing a draft version.
          </div>
        </div>
      )}
      <Header bonus={bonus} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <div className="w-full px-5">
          <article className="prose prose-lg w-full max-w-none dark:prose-invert lg:max-w-xl">
            <MDX
              contents={bonusBodySerialized}
              components={{
                Callout: ({children, ctaLink}) => {
                  return (
                    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 pb-4 shadow-sm dark:bg-gray-700">
                      <div className="flex space-x-3">
                        <span className="flex-shrink-0 pt-5 text-blue-500">
                          <MdOutlineRocketLaunch className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <div className="text-base font-medium leading-none text-blue-700 dark:text-white">
                            {children}
                          </div>
                          {ctaLink && (
                            <Link
                              href={ctaLink}
                              className="block text-base font-semibold text-blue-500 no-underline hover:text-blue-400"
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
          {bonus && (
            <Collection.Root
              module={bonus}
              // lessonPathBuilder={getModuleLessonPath}
              withNumbers={true}
            >
              <div className="flex w-full items-center justify-between pb-3">
                {bonus.resources && (
                  <h3 className="text-xl font-bold">Contents</h3>
                )}
                <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
              </div>
              <Collection.Sections className="space-y-0 overflow-hidden rounded-md border border-er-gray-200 [&_[data-state]]:animate-none">
                {moduleProgressStatus === 'success' ? (
                  <Collection.Section className="border-er-gray-200 bg-transparent font-semibold leading-tight transition data-[state='open']:rounded-none data-[state]:rounded-none data-[state='closed']:border-b hover:bg-er-gray-100 dark:hover:bg-er-gray-100 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-emerald-600 dark:[&>[data-check-icon]]:text-emerald-600 [&>[data-progress='100']]:bg-transparent [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-emerald-500 [&_[data-progress]]:dark:bg-emerald-400">
                    <Collection.Lessons className="rounded-none border-x-0 border-b border-border bg-transparent py-0">
                      <Collection.Lesson className='bg-transparent pl-1 transition before:hidden data-[active="true"]:bg-white hover:bg-er-gray-100 dark:data-[active="true"]:bg-er-gray-200 dark:hover:bg-er-gray-100 dark:hover:data-[active="true"]:bg-er-gray-300 [&_[data-check-icon]]:mr-[3px] [&_[data-check-icon]]:w-3 [&_[data-check-icon]]:text-emerald-600 [&_[data-check-icon]]:opacity-100 dark:[&_[data-check-icon]]:text-emerald-600 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:transition [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:mr-[3px] [&_[data-lock-icon]]:w-3  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
                    </Collection.Lessons>
                  </Collection.Section>
                ) : (
                  <Skeleton className="w-full rounded-none border bg-foreground/5 py-6" />
                )}
              </Collection.Sections>
              {/* Used if module has either none or single section so they can be styled differently */}
              <Collection.Lessons>
                {moduleProgressStatus === 'success' ? (
                  <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:bg-er-gray-300 hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>[data-check-icon]]:text-red-500 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300" />
                ) : (
                  <Skeleton className="my-2 w-full rounded-none border bg-foreground/5 py-5" />
                )}
              </Collection.Lessons>
            </Collection.Root>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default BonusTemplate

const Header: React.FC<{bonus: Bonus}> = ({bonus}) => {
  const {title, slug, image} = bonus
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: bonus.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstLesson = first<Lesson>(bonus.resources)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pb-10 pt-8 sm:pb-16 sm:pt-12 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/workshops"
            className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400 "
          >
            Bonus
          </Link>
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start"></div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              {bonus.resources && (
                <Link
                  href={{
                    pathname: '/bonuses/[module]/[lesson]',
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
                  {isModuleInProgress ? 'Continue' : 'Start'} Watching
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
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
