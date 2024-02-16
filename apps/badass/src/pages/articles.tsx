import * as React from 'react'
import Layout from 'components/layout'
import {GetStaticProps} from 'next'

import {type Article, getAllArticles} from '../lib/articles'
import {CallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from 'components/landing-content'
import Card from 'components/card'
import TitleWithStars from 'components/title-with-stars'

const meta = {
  title: 'Badass Articles',
  ogImage: {
    url: 'https://badass.dev/card@2x.png',
  },
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<React.PropsWithChildren<ArticlesProps>> = ({
  articles,
}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <div className="container mt-6 md:mt-8 lg:mt-11">
        <main>
          <TitleWithStars>Articles</TitleWithStars>
          <div className="mt-8 md:mt-16 lg:mt-[87px] mb-28">
            <div className="grid md:grid-cols-2 gap-4">
              {articles.map((article, i: number) => {
                return (
                  <Card
                    key={article._id}
                    imageUrl={article.articleHeaderImage}
                    title={article.title}
                    authorName={article.author}
                    authorAvatarUrl={article.authorAvatar}
                    description={article.description}
                    href={`/${article.slug}`}
                    type="article"
                    ctaText="Read Article"
                  />
                )
              })}
            </div>
          </div>
        </main>
      </div>
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const articles = await getAllArticles()

  return {
    props: {
      articles,
    },
    revalidate: 10,
  }
}

export default Articles
