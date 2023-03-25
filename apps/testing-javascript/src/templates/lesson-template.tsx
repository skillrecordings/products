import * as React from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import Layout from 'components/layout'
import PortableTextComponents from 'components/portable-text'

const WorkshopTemplate: React.FC<any> = ({lesson, module, transcript}) => {
  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl mb-4 text-primary-500 font-bold">
          {lesson.title}
        </h1>
        <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl mb-4">
          <PortableText
            value={lesson.body}
            components={PortableTextComponents}
          />
        </article>
      </main>
    </Layout>
  )
}

export default WorkshopTemplate
