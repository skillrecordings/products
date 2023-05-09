import React from 'react'
import Layout from 'layouts'
import Image from 'next/image'
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
import ModuleNavigator from '@skillrecordings/skill-lesson/video/module-navigator'
import Balancer from 'react-wrap-balancer'
import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

const TutorialTemplate: React.FC<{
  tutorial: Module
  tutorialBody: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBody}) => {
  const {title, body, ogImage, image, description = '', testimonials} = tutorial
  const pageTitle = `${title} Tutorial`
  return (
    <Layout
      meta={{
        title: pageTitle,
        description: description as string,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header tutorial={tutorial} />
      <main className="relative z-10 flex flex-col gap-10 lg:flex-row max-w-screen-lg mx-auto w-full">
        <div>
          <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
            {tutorialBody && <MDX contents={tutorialBody} />}
          </article>
          {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
        </div>
        {tutorial && <ModuleNavigator module={tutorial} />}
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
      <header className="sm:pt-16 pt-10 max-w-screen-lg mx-auto w-full relative z-10 flex sm:gap-10 flex-col-reverse items-center justify-between pb-10 sm:pb-16 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/tutorials"
            className="inline-block pb-4 font-mono text-sm font-bold uppercase tracking-wide text-amber-300"
          >
            Free Tutorial
          </Link>
          <h1 className="font-text text-center text-3xl font-bold sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-900">
                  <Image
                    src={require('../../public/john-lindquist.jpeg')}
                    alt="John Lindquist"
                    width={48}
                    height={48}
                  />
                </div>
                <span>John Lindquist</span>
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
                  'flex w-full items-center justify-center rounded-md px-5 py-4 font-semibold leading-tight transition bg-gradient-to-b from-amber-300 to-amber-400 via-amber-300 border border-amber-500/20 hover:brightness-110 text-black hover:bg-amber-400 md:w-auto',
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
                  className="flex w-full items-center justify-center gap-2 rounded-md border px-5 py-4 font-medium leading-tight transition border-gray-800 hover:bg-gray-800 md:w-auto"
                  href={`https://github.com/scriptkitapp/${github.repo}`}
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
          <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0">
            <Image
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
