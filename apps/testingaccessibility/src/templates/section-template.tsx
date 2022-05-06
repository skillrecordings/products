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
  const {completedLessons, isCompleted, percentCompleted} =
    getSectionProgressForUser(progress, lessons)

  const currentSectionIndex = indexOf(
    module.sections,
    find(module.sections, {slug: sectionSlug}),
  )
  const nextUpSection = module.sections[currentSectionIndex + 1]

  return (
    <Layout className="bg-white">
      <div className="bg-gray-100">
        <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-2 px-4">
          <BreadcrumbNav module={module} section={section} />
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto flex-grow bg-white">
        <main className="bg-white flex lg:flex-row flex-col xl:px-0 px-5 py-8 lg:gap-16 gap-5">
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
          <article className="mx-auto pt-16">
            <h1 className="text-5xl font-extrabold pb-10">{title}</h1>
            <hr className="w-8 border border-gray-300 mb-10" />
            <div className="prose lg:prose-lg max-w-none">
              <PortableText value={body} components={PortableTextComponents} />
            </div>
            <section className="pt-10">
              {lessons && (
                <nav aria-label="lesson navigator" className="">
                  <h2 className="font-bold text-xl">Lessons</h2>
                  <ol className="list-decimal pt-2 divide-y divide-gray-200">
                    {lessons.map((lesson: SanityDocument) => {
                      const {title, slug} = lesson
                      const isCompleted = find(completedLessons, {
                        lessonSlug: slug,
                      })
                      return (
                        <li
                          key={slug}
                          className="marker:text-xs marker:text-gray-500"
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
                            <a className="text-blue-600 px-3 w-full py-3 flex font-semibold hover:bg-gray-50 transition">
                              {isCompleted && '✅'} {title}
                            </a>
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
        <section
          role="contentinfo"
          className="w-full pt-16 pb-24 bg-gray-50 flex items-center justify-center gap-5 shadow-inner"
        >
          <Link
            href={{
              pathname: '/learn/[module]/[section]',
              query: getPathForSection(nextUpSection.slug, modules as any),
            }}
          >
            <a className="px-5 py-4 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white flex">
              <span className="pr-1">
                Next Up:{' '}
                <span className="font-semibold">{nextUpSection.title}</span>
              </span>
              <ChevronRightIcon className="w-4" aria-hidden="true" />
            </a>
          </Link>
        </section>
      )}
    </Layout>
  )
}

export default SectionTemplate
