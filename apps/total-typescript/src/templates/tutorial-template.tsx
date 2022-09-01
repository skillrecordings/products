import React from 'react'
import Layout from 'components/app/layout'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'

const TutorialTemplate: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  const {title, body, slug, resources} = tutorial
  const pageTitle = `${title} Tutorial`

  return (
    <Layout
      className="max-w-screen-md mx-auto w-full py-24 px-5"
      meta={{title: pageTitle}}
    >
      <header className="py-8">
        <p className="uppercase font-semibold tracking-wide pb-1 text-gray-300">
          Tutorial
        </p>
        <h1 className="sm:text-4xl text-3xl font-bold">{title}</h1>
      </header>
      <main>
        <article className="prose prose-lg text-white">
          <PortableText value={body} />
        </article>
        <section>
          <h2 className="text-2xl font-bold pb-4 pt-8 border-t border-gray-800 mt-8">
            Lessons
          </h2>
          {resources && (
            <ul>
              {resources.map((resource: SanityDocument) => (
                <li key={resource.slug}>
                  <Link
                    href={{
                      pathname: '/tutorials/[module]/[lesson]',
                      query: {module: slug, lesson: resource.slug},
                    }}
                    passHref
                  >
                    <a className="text-lg py-1 font-semibold inline-flex hover:underline">
                      {resource.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Layout>
  )
}

export default TutorialTemplate
