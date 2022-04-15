import React from 'react'
import {VideoProvider} from '@skillrecordings/player'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import Link from 'next/link'

type SectionTemplateProps = {
  section: SanityDocument
  module: SanityDocument
}

const SectionTemplate: React.FC<SectionTemplateProps> = ({section, module}) => {
  const {slug: sectionSlug, title, body, lessons} = section
  return (
    <Layout>
      <div className="container grid grid-cols-12">
        <main className="col-span-9 p-10">
          <nav aria-label="breadcrumb">
            <ol className="flex gap-2">
              <li>
                <Link href="/learn">
                  <a className="underline">Learn</a>
                </Link>
              </li>{' '}
              &gt;{' '}
              <Link
                href={{
                  pathname: '/learn/[module]',
                  query: {module: module.slug},
                }}
              >
                <a className="underline">{module.title}</a>
              </Link>{' '}
              &gt; <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <article>
            <h1 className="text-4xl font-bold pb-5">{title}</h1>
            <div className="prose max-w-none">
              <VideoProvider
                services={{loadResource: () => {}, loadViewer: () => {}}}
              >
                <PortableText
                  value={body}
                  components={PortableTextComponents}
                />
              </VideoProvider>
            </div>
          </article>
        </main>
        <aside className="col-span-3 bg-gray-100">
          {lessons && (
            <nav aria-label="lesson navigator" className="p-5">
              <h3 className="font-bold">Lessons</h3>
              <ol className="list-decimal pl-4">
                {lessons.map((lesson: SanityDocument) => {
                  const {title, slug} = lesson
                  return (
                    <li className="py-1" key={slug}>
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
                        <a className="underline">{title}</a>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}
        </aside>
      </div>
    </Layout>
  )
}

export default SectionTemplate
