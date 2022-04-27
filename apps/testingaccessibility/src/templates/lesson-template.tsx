import React from 'react'
import {VideoProvider} from '@skillrecordings/player'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import Link from 'next/link'
import cx from 'classnames'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import isEmpty from 'lodash/isEmpty'
import {useProgress} from 'context/progress-context'
import {Switch} from '@headlessui/react'

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
  const {title, body, slug} = lesson
  const {lessons} = section
  const currentLessonIndex = indexOf(lessons, find(lessons, {slug}))
  const router = useRouter()

  const {progress, toggleLessonComplete} = useProgress()
  const currentLessonProgress = find(progress, {lessonSlug: slug})
  const isCurrentLessonCompleted = !isEmpty(currentLessonProgress?.completedAt)

  const ProgressToggle = () => {
    const [enabled, setEnabled] = React.useState(isCurrentLessonCompleted)
    function classNames(...classes: any) {
      return classes.filter(Boolean).join(' ')
    }

    return (
      <Switch.Group as="div" className="flex items-center">
        <Switch.Label as="span" className="mr-3">
          <span className="text-gray-900">Mark as completed</span>
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={() => {
            setEnabled(!enabled)
            toggleLessonComplete(slug).catch(() => {
              setEnabled(isCurrentLessonCompleted)
            })
          }}
          className={cx(
            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
            {
              'bg-green-600': enabled,
              'bg-gray-200': !enabled,
            },
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            )}
          />
        </Switch>
      </Switch.Group>
    )
  }

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
                  const isCompleted = find(progress, {lessonSlug: slug})
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
                          {isCompleted && '✅'} {title}
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
          <div className="py-16">
            <ProgressToggle />
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default LessonTemplate
