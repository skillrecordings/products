import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from '@/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from '@/trpc/trpc.client'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
// import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Skeleton,
} from '@skillrecordings/ui'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {ExclamationIcon} from '@heroicons/react/outline'

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

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({})

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )

  return (
    <Layout
      meta={{
        title: pageTitle,
        openGraph: {
          description: description as string,
          images: [{url: ogImage as string, alt: pageTitle as string}],
        },
      }}
    >
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      <CourseMeta title={pageTitle} description={description} />
      <div className="mt-4 px-3 sm:mt-0 sm:px-5 lg:px-8">
        {tutorial.state === 'draft' && (
          <Alert className="mb-3 inline-flex w-full items-baseline rounded border border-dashed border-orange-400/20 bg-orange-400/10 px-4 text-center text-base text-orange-400 [&>svg]:text-orange-400">
            <AlertTitle className="mb-0 inline-flex w-full items-center justify-center gap-1 text-center font-normal">
              <ExclamationIcon className="h-4 w-4" />
              This {tutorial.moduleType} is under development.
            </AlertTitle>
          </Alert>
        )}
        <div className="flex grid-cols-12 flex-col gap-5 xl:grid">
          <div className="col-span-9">
            <Header tutorial={tutorial} />
            <main className="-mt-8 flex w-full flex-grow grid-cols-12 flex-col gap-5 lg:grid xl:flex">
              <div className="col-span-8 mx-auto w-full rounded-xl border bg-card p-10 px-5 pt-16 md:px-10">
                <article className="prose max-w-none lg:prose-lg lg:max-w-screen-lg xl:max-w-screen-md">
                  {tutorialBodySerialized ? (
                    <MDX contents={tutorialBodySerialized} />
                  ) : (
                    <p>No description found.</p>
                  )}
                </article>
              </div>
              <aside className="relative z-10 col-span-4 flex h-full flex-grow flex-col gap-8 pl-2 lg:pt-8 xl:hidden">
                <Lessons tutorial={tutorial} />
              </aside>
              {/* {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )} */}
            </main>
          </div>
          <aside className="relative z-10 col-span-3 hidden h-full flex-grow flex-col gap-8 pl-1 lg:flex-row xl:flex">
            <Lessons tutorial={tutorial} />
          </aside>
        </div>
      </div>
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
      <header className="relative z-10 flex flex-col-reverse items-center justify-between rounded-t-xl rounded-br-xl border bg-card shadow-2xl shadow-black/5 md:flex-row">
        <div className="w-full max-w-screen-sm px-5 pb-10 pt-8 text-center sm:px-10 sm:pb-16 sm:pt-12 md:text-left lg:px-14">
          <Link
            href="/tutorials"
            className="inline-flex items-center justify-center gap-1.5 pb-4 text-[11px] font-semibold uppercase tracking-wide text-gray-500"
          >
            <div
              className="h-1 w-1 animate-pulse rounded-full bg-emerald-500"
              aria-hidden
            />{' '}
            Free Tutorial
          </Link>
          <h1 className="font-text text-center text-3xl font-semibold tracking-tight sm:text-3xl md:text-left lg:text-4xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-5 text-base">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-900">
                  <Image
                    src={require('../../public/jack-herrington.jpg')}
                    alt="Jack Herrington"
                    width={48}
                    height={48}
                    priority
                    placeholder="blur"
                  />
                </div>
                <span>Jack Herrington</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-12 md:flex-row md:justify-start">
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
                  'relative flex w-full items-center justify-center rounded border border-primary bg-primary px-4 py-3 text-lg font-semibold text-white transition hover:brightness-110 focus-visible:ring-white md:max-w-[240px]',
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
          <div className="flex h-full items-center justify-center p-10 lg:border-l">
            <Image
              priority
              src={image}
              alt={title}
              width={400}
              height={400}
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

const Lessons: React.FC<{tutorial: Module}> = ({tutorial}) => {
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: tutorial.slug.current,
    })

  return (
    <div className="h-full w-full px-0 pt-8 lg:max-w-sm xl:max-w-none">
      {tutorial && (
        <Collection.Root module={tutorial}>
          <div className="flex w-full items-center justify-between pb-3">
            <h3 className="text-xl font-bold">Contents</h3>
            <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
          </div>
          <Collection.Sections>
            {moduleProgressStatus === 'success' ? (
              <Collection.Section className="border transition hover:brightness-100 dark:border-white/5 dark:shadow-none dark:hover:brightness-125">
                <Collection.Lessons className="border-border">
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
  )
}
