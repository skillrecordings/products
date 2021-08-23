import * as React from 'react'
import Layout from 'layouts'
import PoliteConvertkitForm from '@skillrecordings/convertkit/dist/forms/polite'
import Markdown from 'react-markdown'
import config from '../config'
import Image from 'next/image'

type ArticleTemplateProps = {
  meta?: any
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({meta, children}) => {
  const {title, image} = meta

  return (
    <Layout meta={meta}>
      <article>
        <header className="py-64 relative flex flex-col items-center justify-center">
          {image && (
            <div className="lg:w-[800px] w-auto absolute">
              <Image src={image} alt="" placeholder="blur" />
            </div>
          )}
          {title && (
            <h1 className="text-8xl font-bold font-din uppercase text-center relative z-10">
              <Markdown>{title}</Markdown>
            </h1>
          )}
        </header>
        <main className="prose prose-dark sm:prose-xl max-w-screen-md prose-lg mx-auto">
          {children}
        </main>
        <footer className="mx-auto max-w-screen-md border-t dark:border-gray-800 border-gray-200 py-16">
          by{' '}
          {meta.contributors
            ? meta.contributors[0].name
            : config.additionalMetaTags[0].content}
        </footer>
      </article>
      <PoliteConvertkitForm peakingContent={'Hello!'}>
        <p>Subscribe today!</p>
      </PoliteConvertkitForm>
    </Layout>
  )
}

export default ArticleTemplate
