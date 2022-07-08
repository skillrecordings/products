import * as React from 'react'
import Layout from 'components/app/layout'
import PopupSubscribeForm from '@skillrecordings/convertkit/dist/forms/popup'
import config from 'config'

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
            <h1 className="py-32 text-5xl font-extrabold leading-tight tracking-tight text-center lg:text-8xl md:text-6xl">
              {title}
            </h1>
          )}
        </header>
        <main className="max-w-screen-md py-32 mx-auto prose prose-lg dark:prose-dark lg:prose-xl">
          {children}
        </main>
        <footer className="max-w-screen-md py-16 mx-auto border-t border-gray-200 dark:border-gray-800">
          by{' '}
          {meta.contributors
            ? meta.contributors[0].name
            : config.additionalMetaTags[0].content}
        </footer>
      </article>
      <PopupSubscribeForm peakingContent={'Hello!'} />
    </Layout>
  )
}

export default ArticleTemplate
