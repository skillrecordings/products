import React from 'react'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {isBrowser} from 'utils/is-browser'
import {track} from '../utils/analytics'
import {portableTextComponents} from '@skillrecordings/skill-lesson/portable-text'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {first} from 'lodash'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {WorkshopSectionNavigator} from './workshop-template'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

const TutorialTemplate: React.FC<{
  tutorial: Module & {
    description: string
    ogImage: string
    sections: Section[]
  }
  tutorialBodySerialized: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBodySerialized}) => {
  const {title, body, ogImage, description} = tutorial
  const pageTitle = `${title} Tutorial`

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg px-5 py-16"
      meta={{
        title: pageTitle,
        description,
        ogImage: ogImage
          ? {
              url: ogImage,
              alt: pageTitle,
            }
          : undefined,
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header tutorial={tutorial} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
          <MDX contents={tutorialBodySerialized} />
        </article>
        <div className="lg:max-w-sm">
          <WorkshopSectionNavigator
            workshop={tutorial}
            purchased={true}
            path="tutorials"
          />
        </div>
      </main>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: Module}> = ({tutorial}) => {
  const {title, slug, sections, image, github} = tutorial

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons)

  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: tutorial.slug.current,
  })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const completedLessonCount = moduleProgress?.completedLessonCount || 0
  const nextLesson = moduleProgress?.nextLesson
  const nextSection = moduleProgress?.nextSection

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between pb-16 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link
            href="/tutorials"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-brand-red"
          >
            Free Tutorial
          </Link>
          <h1 className="font-text max-w-4xl pt-5 font-heading text-4xl font-black lg:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/assets/simon-vrachliotis.png')}
                    alt="Simon Vrachliotis"
                    width={48}
                    height={48}
                  />
                </div>
                <span>Simon Vrachliotis</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-8">
              {firstSection && (
                <Link
                  href={{
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
                  }}
                  className="flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  {isModuleInProgress ? 'Continue' : 'Start'} Learning{' '}
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {github?.repo && (
                <a
                  className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  href={`https://github.com/pro-tailwind/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" size="20" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="flex items-center justify-center">
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
    </>
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
