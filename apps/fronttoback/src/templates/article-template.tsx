import React from 'react'
import Layout from 'components/app/layout'
import type {ArticlePageProps} from 'pages/[article]'
import {PortableText, toPlainText} from '@portabletext/react'

const ArticleTemplate: React.FC<ArticlePageProps> = ({article}) => {
  const {title, body} = article
  const description =
    article.description || toPlainText(body).substring(0, 157) + '...'

  return (
    <Layout meta={{title, description}}>
      <header className="sm:pt-48 pt-48 sm:p-10 p-5 bg-brand-purple relative overflow-hidden">
        <h1 className="sm:fluid-5xl fluid-4xl font-bold max-w-5xl w-full mx-auto !leading-tight">
          {title}
        </h1>
      </header>
      <main className="sm:p-10 p-5 sm:py-16 py-10">
        <article className="max-w-2xl mx-auto w-full prose sm:prose-lg">
          <PortableText value={body} />
        </article>
        {/* <section>Share</section> */}
      </main>
    </Layout>
  )
}

export default ArticleTemplate
