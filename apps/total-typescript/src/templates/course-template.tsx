import React from 'react'
import Layout from 'components/app/layout'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'

const CourseTemplate: React.FC<any> = ({course}) => {
  const {title, body, slug, resources} = course
  return (
    <Layout className="max-w-screen-md mx-auto w-full py-24">
      {/* <pre>{JSON.stringify(course, null, 2)}</pre> */}
      <header className="py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>
      <main>
        <article className="prose prose-lg text-white">
          <PortableText value={body} />
        </article>
        <section>
          <h2 className="text-2xl font-bold py-8">Lessons</h2>
          {resources && (
            <ul>
              {resources.map((resource: SanityDocument) => (
                <Link
                  href={{
                    pathname: '/[course]/[lesson]',
                    query: {course: slug, lesson: resource.slug},
                  }}
                  passHref
                >
                  <a>
                    {resource.title} {resource.path}
                  </a>
                </Link>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Layout>
  )
}

export default CourseTemplate
