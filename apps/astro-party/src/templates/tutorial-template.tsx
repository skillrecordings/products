import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from 'trpc/trpc.client'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import ModuleNavigator from '@skillrecordings/skill-lesson/video/module-navigator'
import Balancer from 'react-wrap-balancer'
import config from 'config'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getOgImage} from 'utils/get-og-image'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
// import Testimonials from 'testimonials'

const TutorialTemplate: React.FC<{
  tutorial: Module
  tutorialBody: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBody}) => {
  const {title, ogImage, image, description, testimonials} = tutorial
  const pageTitle = `${title} Tutorial`
  const shareCard = ogImage
    ? ogImage
    : getOgImage({
        title,
        image: image ? image : undefined,
        byline: 'Free Tutorial',
      }).url

  return (
    <Layout
      className="mx-auto w-full max-w-screen-xl"
      meta={{
        title,
        openGraph: {
          description: description as string,
          images: [{url: shareCard}],
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header tutorial={tutorial} />
      <main className="relative z-10 mx-auto flex max-w-screen-lg flex-col justify-between gap-5 lg:flex-row">
        <div className="px-5">
          <article className="prose w-full max-w-none sm:prose-lg">
            {tutorialBody && <MDX contents={tutorialBody} />}
          </article>
          {/* {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )} */}
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
      <header className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col-reverse items-center justify-between px-5 pb-16 pt-8 sm:pb-8 md:flex-row">
        <div className="w-full pt-8 text-center sm:pt-0 md:text-left">
          <Link
            href="/tutorials"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-brand-primary"
          >
            Tutorial
          </Link>
          <h1 className="text-center text-4xl font-bold sm:text-5xl md:text-left lg:text-6xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/jason-lengstorf.jpg')}
                    alt={config.author}
                    width={48}
                    height={48}
                    className="bg-gray-200"
                  />
                </div>
                <span>{config.author}</span>
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
                  'flex w-full items-center justify-center rounded bg-brand-primary px-5 py-4 font-semibold leading-tight text-white transition hover:brightness-110 md:w-auto',
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
                  className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-gray-800 px-5 py-4 font-medium leading-tight transition hover:bg-gray-800 md:w-auto"
                  href={`https://github.com/total-typescript/${github.repo}`}
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
          <div className="-mr-5 flex flex-shrink-0 items-center justify-center">
            <Image
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
