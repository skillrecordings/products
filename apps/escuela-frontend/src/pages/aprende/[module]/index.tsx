import React from 'react'

import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {getAllCourses, getModule} from 'lib/courses'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'
import PortableTextComponents from 'components/portable-text'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const course = await getModule(params?.module as string)

  return {
    props: {course},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCourses()
  const paths = courses.map((course: any) => ({
    params: {module: course.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const CoursePage: React.FC<{
  course: SanityDocument
}> = ({course}) => {
  const {title, slug, lessons, image, github, body} = course
  return (
    <>
      {title && <h1>{title}</h1>}
      {image && (
        <div className="flex items-center justify-center lg:-mr-16">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            quality={100}
          />
        </div>
      )}
      {github && (
        <a
          className="flex items-center justify-center gap-2 rounded border-2 border-gray-800 px-5 py-3 font-medium transition hover:bg-gray-800"
          href={`https://github.com/total-typescript/${github.repo}`}
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      )}
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none lg:max-w-xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
      </main>
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
          <a className="flex items-center justify-center rounded bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300">
            Start Learning{' '}
            <span className="pl-2" aria-hidden="true">
              →
            </span>
          </a>
        </Link>
      )}
      <h2 className="pb-4 font-mono text-sm font-semibold uppercase text-gray-300">
        {lessons?.length || 0} Lessons
      </h2>

      {lessons && (
        <ul>
          {lessons.map((lesson: any, i: number) => {
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
    </>
  )
}

export default CoursePage
