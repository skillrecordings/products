import React from 'react'
import {
  getModuleProgressForUser,
  getSectionProgressForUser,
} from 'utils/progress'
import {useProgress} from 'context/progress-context'
import {CheckIcon} from '@heroicons/react/solid'
import {PortableText} from '@portabletext/react'
import {SkipNavContent} from '@reach/skip-nav'
import {getOgImage} from 'utils/get-og-image'
import {SanityDocument} from '@sanity/client'
import PortableTextComponents, {InternalLink} from 'components/portable-text'
import BreadcrumbNav from 'components/breadcrumb'
import Layout from 'components/app/layout'
import pluralize from 'pluralize'
import find from 'lodash/find'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import {LessonProgress} from '@skillrecordings/database'

type ModuleTemplateProps = {
  module: SanityDocument
}

const ModuleTemplate: React.FC<ModuleTemplateProps> = ({module}) => {
  const {slug, title, body, sections, image, resources} = module
  const ogImage = getOgImage(title, image.url)
  const {progress} = useProgress()
  const {completedSections, percentCompleted, isCompleted} =
    getModuleProgressForUser(progress, sections)
  const allLessonsInModule = sections?.flatMap(
    (section: SanityDocument) => section.lessons,
  )

  return (
    <Layout meta={{title, ogImage}} skipNavContent={null}>
      <main>
        <header className="bg-gray-100">
          <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-2 px-4">
            <BreadcrumbNav module={module} />
          </div>
        </header>
        <SkipNavContent />
        <div className="w-full bg-gray-100">
          <div className="bg-green-700 bg-noise py-10 text-white">
            <div className="max-w-screen-lg flex md:flex-row flex-col items-center justify-center mx-auto px-5">
              <div>
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={300}
                  height={300}
                />
              </div>
              <div className="md:text-left text-center max-w-lg">
                <h1 className="font-heading md:text-5xl text-4xl font-bold">
                  {title}
                </h1>
                <div className="pt-5 font-display flex items-center md:justify-start justify-center gap-2 text-sand-100">
                  <span>
                    {sections?.length +
                      ' ' +
                      pluralize('section', sections?.length)}
                  </span>
                  <span className="opacity-70" aria-hidden="true">
                    ・
                  </span>
                  <span>
                    {allLessonsInModule?.length +
                      ' ' +
                      pluralize('lesson', allLessonsInModule?.length)}
                  </span>
                </div>
                {resources && (
                  <div className="pt-5">
                    <Resources resources={resources} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pb-10 md:-mt-5">
            {sections && <Sections progress={progress} module={module} />}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ModuleTemplate

type SectionsProps = {
  progress: LessonProgress[]
  module: SanityDocument
}

type Resource = {
  label: string
  href: string
  _type: string
  image?: {
    url: string
    alt: string
  }
}

const Resources: React.FC<{resources: Resource[]}> = ({resources}) => {
  return (
    <div className="flex md:justify-start justify-center flex-wrap gap-3 max-w-screen-md mx-auto w-full md:p-0 p-5">
      {resources.map((resource) => {
        const {label, href, _type: type, image} = resource
        const ResourceBox: React.FC = ({children}) => {
          return (
            <div
              className={cx(
                'group-hover:underline flex items-center gap-2 font-medium px-2 py-1.5 rounded-md bg-black/10 group-hover:bg-black/20 text-sm',
                {
                  'pr-4': image,
                },
              )}
            >
              {image && (
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={28}
                  height={28}
                  quality={100}
                />
              )}
              {children}
            </div>
          )
        }
        if (type === 'internalLink') {
          return (
            <InternalLink key={href} value={resource} className="group">
              <ResourceBox>{label}</ResourceBox>
            </InternalLink>
          )
        }
        if (type === 'externalLink') {
          return (
            <a
              key={href}
              className="group"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ResourceBox>{label}</ResourceBox>
            </a>
          )
        }
      })}
    </div>
  )
}

const Sections: React.FC<SectionsProps> = ({progress, module}) => {
  return (
    <ol className="md:space-y-5 space-y-2">
      {module.sections.map((section: SanityDocument, i: number) => {
        const {image} = section
        const {isCompleted: isSectionCompleted} = getSectionProgressForUser(
          progress,
          section.lessons,
        )

        const isCompleted =
          isSectionCompleted ??
          find(progress, {lessonSlug: section.slug})?.completedAt

        return (
          <li
            key={section.slug}
            className={cx(
              'bg-white p-8 md:rounded-lg flex md:flex-row flex-col max-w-screen-md mx-auto w-full',
            )}
          >
            <div className="w-full">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cx(
                    'flex items-center justify-center w-6 h-6 uppercase font-mono font-medium text-xs text-gray-600 leading-none rounded-full',
                    {
                      'text-white  bg-green-500': isCompleted,
                      'border border-gray-300': !isCompleted,
                    },
                  )}
                >
                  {isCompleted ? <CheckIcon className="w-4 h-4" /> : i + 1}
                </span>
                <Link
                  href={{
                    pathname: '/learn/[module]/[section]',
                    query: {
                      module: module.slug,
                      section: section.slug,
                    },
                  }}
                  passHref
                >
                  <a className="hover:underline text-3xl font-bold font-heading inline-block leading-tight">
                    <h2>
                      {section.title}{' '}
                      {isCompleted && (
                        <span className="sr-only">(completed)</span>
                      )}{' '}
                      {i === 0 && module.sections.length > 1 && (
                        <span className="font-display font-medium text-xl">
                          (start here)
                        </span>
                      )}
                    </h2>
                  </a>
                </Link>
              </div>
              {section.lessons && section.body && (
                <div className="pt-8 prose">
                  <PortableText
                    components={PortableTextComponents}
                    value={section.body}
                  />
                </div>
              )}
              {section.lessons && (
                <div className="pt-8">
                  <div className="flex items-center gap-4">
                    <h2 className="uppercase text-xs font-semibold">Lessons</h2>
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <ol className="list-none pt-2 divide-y divide-gray-100">
                    {section.lessons.map(
                      (lesson: SanityDocument, i: number) => {
                        const isCompleted = find(progress, {
                          lessonSlug: lesson.slug,
                        })?.completedAt

                        return (
                          <li
                            key={lesson.slug}
                            className=" -ml-4 relative flex items-baseline before:pt-4 before:opacity-60 before:absolute before:content-[attr(data-index)] before:text-xs marker:text-gray-400 before:pl-2 group "
                          >
                            <Link
                              href={{
                                pathname: '/learn/[module]/[section]/[lesson]',
                                query: {
                                  module: module.slug,
                                  section: section.slug,
                                  lesson: lesson.slug,
                                },
                              }}
                              passHref
                            >
                              <a
                                aria-label={`${lesson.title} ${
                                  isCompleted ? '(completed)' : ''
                                }`}
                                data-index={isCompleted ? '✓' : i + 1}
                                className={cx(
                                  `group pl-4 group-hover:bg-gray-50 text-gray-800 hover:text-gray-900 w-full font-semibold py-4 transition relative items-center inline-flex before:font-semibold before:flex before:items-center before:justify-center before:font-mono before:content-[attr(data-index)] before:w-5 before:h-5 before:left-0 before:rounded-full before:flex-shrink-0`,
                                  {
                                    'before:text-[0.55em] before:text-gray-500 before:border before:border-gray-300':
                                      !isCompleted,
                                    'before:text-sm before:text-white  before:bg-green-500':
                                      isCompleted,
                                  },
                                )}
                              >
                                <span className="pl-3">{lesson.title} </span>
                                {isCompleted && (
                                  <span className="sr-only">(completed)</span>
                                )}
                              </a>
                            </Link>
                          </li>
                        )
                      },
                    )}
                  </ol>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
