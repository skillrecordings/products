import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import React from 'react'
import PortableTextComponents from 'components/portable-text'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {isBrowser} from 'utils/is-browser'
import {PortableText} from '@portabletext/react'
import Link from 'next/link'
import {Lesson} from 'lib/lessons'
import Image from 'next/image'
import {IconGithub} from 'components/icons'

const CourseTemplate: React.FC<{
  course: SanityDocument
}> = ({course}) => {
  const {title, body, ogImage, description} = course
  const pageTitle = `${title} Course`

  return (
    <Layout
      className="mx-auto w-full max-w-4xl py-24 px-5 "
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
      <Header course={course} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
        <CourseLessonNavigator course={course} />
      </main>
    </Layout>
  )
}

export default CourseTemplate

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

const CourseLessonNavigator: React.FC<{course: SanityDocument}> = ({
  course,
}) => {
  const {slug, lessons} = course
  return (
    <nav
      aria-label="lesson navigator"
      className="border-gray-200 lg:border-l lg:pl-8"
    >
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase">
        {lessons?.length || 0} classes
      </h2>
      {lessons && (
        <ul>
          {lessons.map((lesson: Lesson, i: number) => {
            return (
              <li key={lesson.slug}>
                <Link
                  href={{
                    pathname: '/aprende/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: lesson.slug,
                    },
                  }}
                  passHref
                >
                  <a className="group inline-flex items-center py-2.5 text-lg font-semibold">
                    <span className="w-8 font-mono text-xs " aria-hidden="true">
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

const Header: React.FC<{course: SanityDocument}> = ({course}) => {
  const {title, slug, lessons, image, github} = course

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between pt-0 pb-16 sm:pt-8 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/tutorials">
            <a className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-blue-600">
              Course
            </a>
          </Link>
          <h1 className="font-text text-5xl font-bold lg:text-6xl">{title}</h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center gap-3 pt-8">
              {lessons?.[0] && (
                <Link
                  href={{
                    pathname: '/aprende/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: lessons[0].slug,
                    },
                  }}
                >
                  <a className="flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white transition">
                    Iniciar Curso{' '}
                    <span className="pl-2" aria-hidden="true">
                      →
                    </span>
                  </a>
                </Link>
              )}
              {github && (
                <a
                  className="flex items-center justify-center gap-2 rounded border-2 border-gray-800 px-5 py-3 font-medium transition hover:bg-gray-200"
                  href={`https://github.com/escuela-frontend/${github.repo}`}
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
