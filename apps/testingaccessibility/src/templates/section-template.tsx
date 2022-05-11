import React from 'react'
import {getPathForSection} from 'utils/get-resource-paths'
import {getSectionProgressForUser} from 'utils/progress'
import {ChevronRightIcon} from '@heroicons/react/solid'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import PortableTextComponents from 'components/portable-text'
import BreadcrumbNav from 'components/breadcrumb'
import Layout from 'components/app/layout'
import indexOf from 'lodash/indexOf'
import find from 'lodash/find'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'

type SectionTemplateProps = {
  section: SanityDocument
  module: SanityDocument
  modules: SanityDocument[]
}

const SectionTemplate: React.FC<SectionTemplateProps> = ({
  section,
  module,
  modules,
}) => {
  const {slug: sectionSlug, title, body, lessons, image} = section
  const {progress} = useProgress()

  const currentSectionIndex = indexOf(
    module.sections,
    find(module.sections, {slug: sectionSlug}),
  )
  const nextUpSection = module.sections[currentSectionIndex + 1]

  return (
    <Layout className="bg-gray-50 flex-grow">
      <div className="bg-gray-100">
        <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-1 px-2 overflow-x-auto">
          <BreadcrumbNav module={module} section={section} />
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto flex-grow">
        <main className="flex lg:flex-row flex-col xl:px-0 px-5 py-12 lg:gap-16 gap-5">
          {image.url && (
            <div className="flex-shrink-0 md:block flex items-center justify-center">
              <Image
                src={image.url}
                width={512 / 1.5}
                height={512 / 1.5}
                quality={100}
                alt={image.alt}
              />
            </div>
          )}
          <article className="mx-auto pt-8">
            <h1 className="text-5xl font-extrabold pb-10">{title}</h1>

            <div className="prose lg:prose-lg max-w-none">
              <PortableText value={body} components={PortableTextComponents} />
            </div>
            <section className="pt-10">
              {lessons && (
                <nav aria-label="lesson navigator" className="">
                  <h2 className="font-bold text-xl">Lessons</h2>
                  <ol className="list-none divide-y divide-gray-100">
                    {lessons.map((lesson: SanityDocument, i: number) => {
                      const {title, slug} = lesson
                      const isCompleted = find(progress, {
                        lessonSlug: slug,
                      })?.completedAt
                      return (
                        <li
                          key={slug}
                          className="group marker:text-xs marker:text-gray-500"
                        >
                          <Link
                            href={{
                              pathname: '/learn/[module]/[section]/[lesson]',
                              query: {
                                module: module.slug,
                                section: sectionSlug,
                                lesson: slug,
                              },
                            }}
                            passHref
                          >
                            <a
                              aria-label={`${title} ${
                                isCompleted ? '(completed)' : ''
                              }`}
                              data-index={isCompleted ? '✓' : i + 1}
                              className={cx(
                                ` -mx-3 px-3 hover:bg-white w-full font-semibold py-4 hover:text-gray-900 text-gray-700 relative items-center inline-flex before:font-semibold before:flex before:items-center before:justify-center before:font-mono before:content-[attr(data-index)] before:w-5 before:h-5 before:border before:bg-white before:left-0 before:rounded-full before:flex-shrink-0`,
                                {
                                  'before:text-[0.55em] before:text-gray-500 before:border-gray-300':
                                    !isCompleted,
                                  'before:text-sm before:text-white before:border-green-600 before:bg-green-600':
                                    isCompleted,
                                },
                              )}
                            >
                              <span className="pl-3">{title} </span>
                              {isCompleted && (
                                <span className="sr-only">(completed)</span>
                              )}
                            </a>
                            {/* <a className="text-blue-600 px-3 w-full py-3 flex font-semibold hover:bg-gray-50 transition">
                              {isCompleted && '✅'} {title}
                            </a> */}
                          </Link>
                        </li>
                      )
                    })}
                  </ol>
                </nav>
              )}
            </section>
          </article>
        </main>
      </div>
      {nextUpSection && currentSectionIndex === 0 && (
        <div className="w-full py-16 bg-gray-50 flex items-center justify-center gap-5">
          <Link
            href={{
              pathname: '/learn/[module]/[section]',
              query: getPathForSection(nextUpSection.slug, modules as any),
            }}
          >
            <a className="px-5 py-4 rounded-md bg-gray-900 transition text-white flex">
              <span className="pr-1">
                Next Up:{' '}
                <span className="font-semibold">{nextUpSection.title}</span>
              </span>
              <ChevronRightIcon className="w-4" aria-hidden="true" />
            </a>
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default SectionTemplate
