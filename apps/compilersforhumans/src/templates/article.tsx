import * as React from 'react'
import Layout from 'layouts'
//TODO: Check form styling
import PoliteConvertkitForm from '@skillrecordings/convertkit/dist/forms/polite'
import config from '../../config.json'

type ArticleTemplateProps = {
  meta?: any
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({meta, children}) => {
  const {title} = meta

  return (
    <Layout meta={meta}>
      <article>
        <header>
          {title && (
            <h1 className="lg:text-8xl md:text-6xl text-5xl font-extrabold  leading-tight text-center  py-32">
              {title}
            </h1>
          )}
        </header>
        <main className="prose dark:prose-dark lg:prose-xl prose-lg mx-auto py-32 max-w-screen-md">
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
