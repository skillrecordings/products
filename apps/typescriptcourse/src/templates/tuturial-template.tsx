import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {isBrowser} from 'utils/is-browser'
// import {useConvertkit} from 'hooks/use-convertkit'
import {Lesson} from 'lib/lesson'
import PortableTextComponents from 'components/portable-text'
import {IconGithub} from 'components/icons'

const TutorialTemplate: React.FC<{
  tutorial: SanityDocument
}> = ({tutorial}) => {
  const {title, body, ogImage, image, description} = tutorial
  const pageTitle = `${title} Tutorial`

  return (
    <Layout
      meta={{
        title: pageTitle,
        description,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      <section className="mx-auto w-full max-w-screen-lg py-24 lg:px-20 xl:px-20 px-5">
        <CourseMeta title={pageTitle} description={description} />
        <Header tutorial={tutorial} />
        <main className="relative z-10 flex flex-col gap-5 lg:flex-row mx-auto w-full max-w-screen-lg py-24 px-5">
          <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
          <TutorialLessonNavigator tutorial={tutorial} />
        </main>
      </section>
    </Layout>
  )
}

export default TutorialTemplate

const Header: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, slug, lessons, image, github} = tutorial

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between pb-16 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/tutorials">
            <a className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-brand-red text-blue-400">
              Free Tutorial
            </a>
          </Link>
          <h1 className="max-w-4xl font-bold leading-none font-heading pt-5 text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/images/joe-previte.jpeg')}
                    alt="Joe Previte"
                    width={48}
                    height={48}
                  />
                </div>
                <span>Joe Previte</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-8">
              {lessons?.[0] && (
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: lessons[0].slug,
                    },
                  }}
                >
                  <a className="flex items-center justify-center rounded-lg bg-blue-400 font-semibold hover:brightness-125 px-4 py-2">
                    Start Learning{' '}
                    <span className="pl-2" aria-hidden="true">
                      →
                    </span>
                  </a>
                </Link>
              )}
              {github && (
                <a
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-2 font-medium transition hover:bg-gray-800"
                  href={github.url}
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
          <div className="flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={250}
              height={250}
              quality={100}
            />
          </div>
        )}
      </header>
    </>
  )
}

const TutorialLessonNavigator: React.FC<{tutorial: SanityDocument}> = ({
  tutorial,
}) => {
  const {slug, lessons, _type} = tutorial
  return (
    <nav
      aria-label="lesson navigator"
      className="border-gray-200 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-600">
        {lessons?.length || 0} Lessons
      </h2>
      {lessons && (
        <ul>
          {lessons.map((lesson: Lesson, i: number) => {
            return (
              <li key={lesson.slug}>
                <Link
                  href={{
                    pathname: '/tutorials/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: lesson.slug,
                    },
                  }}
                  passHref
                >
                  <a className="group inline-flex items-center py-2.5 text-lg font-semibold">
                    <span
                      className="w-8 font-mono text-xs text-gray-400"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="w-full leading-tight group-hover:underline">
                      {lesson.title}
                    </span>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
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
