import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {type Article, getAllArticles, getArticle} from '@/lib/articles'
import ArticleTemplate from '../templates/article-template'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
// import readingTime from 'reading-time'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const articles = await getAllArticles()
  const article = await getArticle(params?.article as string)

  if (!article) {
    return {
      notFound: true,
    }
  }

  const articleBodySerialized = await serializeMDX(article.body, {
    syntaxHighlighterOptions: {
      theme: 'slack-dark',
      showCopyButton: true,
    },
  })
  const estimatedReadingTime = {minutes: 1} // readingTime(article.body)
  const allButCurrentArticles = articles.filter(
    (article) => article.slug !== params?.article,
  )
  const randomArticles = [...allButCurrentArticles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)

  return {
    props: {
      article,
      articles: randomArticles,
      articleBodySerialized,
      estimatedReadingTime: estimatedReadingTime.minutes.toFixed(0),
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles()
  const paths = articles.map((article: Article) => ({
    params: {article: article.slug},
  }))
  return {paths, fallback: 'blocking'}
}

export type ArticlePageProps = {
  article: Article
  articles: Article[]
  articleBodySerialized: MDXRemoteSerializeResult
  estimatedReadingTime: number
}

const Article: React.FC<ArticlePageProps> = ({
  article,
  articles,
  articleBodySerialized,
  estimatedReadingTime,
}) => {
  return article ? (
    <ArticleTemplate
      article={article}
      articles={articles}
      articleBodySerialized={articleBodySerialized}
      estimatedReadingTime={estimatedReadingTime}
    />
  ) : null
}

export default Article
