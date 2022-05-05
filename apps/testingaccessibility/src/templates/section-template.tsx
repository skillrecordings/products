import React from 'react'
import {VideoProvider} from '@skillrecordings/player'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {getSectionProgressForUser} from 'utils/progress'
import {useProgress} from 'context/progress-context'
import {find} from 'lodash'
import BreadcrumbNav from 'components/breadcrumb'
import Image from 'next/image'

type SectionTemplateProps = {
  section: SanityDocument
  module: SanityDocument
}

const SectionTemplate: React.FC<SectionTemplateProps> = ({section, module}) => {
  const {slug: sectionSlug, title, body, lessons, image} = section
  const {progress} = useProgress()
  const {completedLessons, isCompleted, percentCompleted} =
    getSectionProgressForUser(progress, lessons)

  return (
    <Layout className="bg-white">
      <div className="bg-gray-100">
        <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-2 px-4">
          <BreadcrumbNav module={module} section={section} />
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto flex-grow bg-white">
        <main className="bg-white flex py-8 gap-16">
          {image.url && (
            <div className="flex-shrink-0">
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
            <div className="prose md:prose-lg max-w-none">
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
    </Layout>
  )
}

export default SectionTemplate
