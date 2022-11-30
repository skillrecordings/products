import React from 'react'
import {type Article, getArticle} from 'lib/articles'
import {GetStaticPaths, GetStaticProps} from 'next'
import {sanityClient} from 'utils/sanity-client'
import ArticleTemplate from 'templates/article-template'
import groq from 'groq'

const allArticlesQuery = groq`*[_type == "article"]{
  "slug": slug.current,
  }`

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const article = await getArticle(params?.article as string)
  if (!article) {
    return {
      notFound: true,
    }
  }
  return {
    props: {article},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const articles = await sanityClient.fetch(allArticlesQuery)

  const paths = articles.map((article: Article) => {
    return {
      params: {
        article: article.slug,
      },
    }
  })

  return {paths, fallback: 'blocking'}
}

type ArticlePageProps = {
  article: Article
  hasSubscribed: boolean
}

const ArticlePage: React.FC<ArticlePageProps> = ({article, hasSubscribed}) => {
  return article ? (
    <ArticleTemplate article={article} hasSubscribed={hasSubscribed} />
  ) : null
}

export default ArticlePage
