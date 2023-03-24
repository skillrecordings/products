import * as React from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import Layout from 'components/layout'
import PortableTextComponents from 'components/portable-text'

const WorkshopTemplate: React.FC<any> = ({workshop}) => {
  console.log({workshop})
  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl mb-4 text-primary-500 font-bold">
          {workshop.title}
        </h1>
        <div className="mb-4">{workshop.lessons.length} lessons</div>
        <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl mb-4">
          <PortableText
            value={workshop.body}
            components={PortableTextComponents}
          />
        </article>
        <ul className="list list-decimal">
          {workshop.lessons.map((lesson: any) => {
            return (
              <li key={lesson.id}>
                <Link
                  href={{
                    pathname: `/workshops/[workshop]/[lesson]`,
                    query: {
                      workshop: workshop.slug,
                      lesson: lesson.slug,
                    },
                  }}
                >
                  {lesson.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default WorkshopTemplate
