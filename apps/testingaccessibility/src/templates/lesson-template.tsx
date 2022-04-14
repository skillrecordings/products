import React from 'react'
import {VideoProvider} from '@skillrecordings/player'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {find, indexOf} from 'lodash'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import Link from 'next/link'
import cx from 'classnames'

type LessonTemplateProps = {
  module: SanityDocument
  section: SanityDocument
  lesson: SanityDocument
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  module,
  section,
  lesson,
}) => {
  const {title, body} = lesson
  const {lessons} = section
  const currentLessonIndex = indexOf(
    lessons,
    find(lessons, {slug: lesson.slug}),
  )
  const router = useRouter()

  return (
    <Layout className="bg-gray-100">
      <div className="max-w-screen-lg mx-auto grid grid-cols-12 flex-grow">
        <aside className="col-span-3">
          {lessons && (
            <nav aria-label="lesson navigator" className="p-5 py-8">
              <h3 className="font-bold pb-4 text-lg">Lesson Navigator</h3>
              <ol className="list-none flex flex-col">
                {lessons.map((lesson: SanityDocument, i: number) => {
                  const {title, slug} = lesson
                  const isActive = router.query.lesson === slug
                  return (
                    <li className="pb-3" key={slug}>
                      <Link
                        href={{
                          pathname: '/learn/[module]/[section]/[lesson]',
                          query: {
                            module: module.slug,
                            section: section.slug,
                            lesson: slug,
                          },
                        }}
                        passHref
                      >
                        <a
                          data-index={i + 1}
                          className={cx(
                            `relative flex after:font-semibold after:text-gray-500 after:flex after:items-center after:justify-center after:text-[0.55em] after:font-mono after:absolute after:content-[attr(data-index)] after:w-5 after:h-5 after:border after:border-gray-300 after:bg-gray-100 after:-left-7 after:rounded-full after:top-0.5 before:absolute before:h-full before:left-[-18px] before:w-[1px] before:bg-gray-300 before:top-4`,
                            {
                              'font-semibold': isActive,
                              '': !isActive,
                            },
                          )}
                        >
                          {title}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}
        </aside>
        <main className="col-span-9 bg-white px-16">
          <nav aria-label="breadcrumb" className="py-8 flex items-center">
            <ol className="flex gap-2">
              <li>
                <Link href="/learn">
                  <a className="underline">Learn</a>
                </Link>
              </li>{' '}
              &gt;
              <Link
                href={{
                  pathname: '/learn/[module]',
                  query: {module: module.slug},
                }}
              >
                <a className="underline">{module.title}</a>
              </Link>{' '}
              &gt;
              <li>
                <Link
                  href={{
                    pathname: '/learn/[module]/[section]',
                    query: {module: module.slug, section: section.slug},
                  }}
                >
                  <a className="underline">{section.title}</a>
                </Link>
              </li>{' '}
              &gt; <li aria-current="page">Lesson {currentLessonIndex + 1}</li>
            </ol>
          </nav>
          <article className="py-5 mx-auto">
            <h1 className="text-4xl font-bold pb-10">{title}</h1>
            <div className="prose md:prose-lg max-w-none">
              <VideoProvider>
                <PortableText
                  value={body}
                  components={PortableTextComponents}
                />
              </VideoProvider>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}

export default LessonTemplate
