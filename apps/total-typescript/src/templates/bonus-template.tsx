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
import {ModuleNavigator} from './workshop-template'
import Balancer from 'react-wrap-balancer'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

const BonusTemplate: React.FC<{
  bonus: Module
  bonusBodySerialized: MDXRemoteSerializeResult
}> = ({bonus, bonusBodySerialized}) => {
  const {title, body, ogImage, description} = bonus
  const pageTitle = `${title}`

  return (
    <Layout
      className="mx-auto w-full pt-20 lg:max-w-4xl lg:pb-24"
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
      <Header bonus={bonus} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none px-5 text-white prose-a:text-cyan-300 hover:prose-a:text-cyan-200 lg:max-w-xl">
          <MDX contents={bonusBodySerialized} />
        </article>
        {bonus && <ModuleNavigator module={bonus} />}
      </main>
    </Layout>
  )
}

export default BonusTemplate

const Header: React.FC<{bonus: Module}> = ({bonus}) => {
  const {title, slug, sections, image, github} = bonus
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: bonus.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || bonus.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pb-16 pt-0 sm:pb-8 sm:pt-8 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/bonuses"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-yellow-200"
          >
            Bonus
          </Link>
          <h1 className="text-center font-text text-4xl font-bold sm:text-5xl md:text-left lg:text-6xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
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
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              <Link
                href={
                  firstSection && sections
                    ? {
                        pathname: '/bonuses/[module]/[section]/[lesson]',
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
                        pathname: '/bonuses/[module]/[lesson]',
                        query: {
                          module: slug.current,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                }
                className={cx(
                  'flex w-full items-center justify-center rounded bg-cyan-400 px-5 py-4 font-semibold leading-tight text-black transition hover:bg-cyan-300 md:w-auto',
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
          <div className="flex flex-shrink-0 items-center justify-center lg:-mr-16">
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
