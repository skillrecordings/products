import React from 'react'
import {type Article, getArticle} from 'lib/articles'
import {GetStaticPaths, GetStaticProps} from 'next'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import ArticleTemplate from 'templates/article-template'
import groq from 'groq'
import serializeMdx from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import readingTime from 'reading-time'

const allArticlesQuery = groq`*[_type == "article"]{
  "slug": slug.current,
  }`

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const article = await getArticle(params?.article as string)
  const articleBodySerialized = await serializeMdx(article.body, {
    syntaxHighlighterOptions: {
      theme: 'one-dark-pro',
    },
  })
  const estimatedReadingTime = readingTime(article.body)

  if (!article) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      article,
      articleBodySerialized,
      estimatedReadingTime: estimatedReadingTime.minutes.toFixed(0),
    },
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
  articleBodySerialized: MDXRemoteSerializeResult
  estimatedReadingTime: number
  hasSubscribed: boolean
}

const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  articleBodySerialized,
  estimatedReadingTime,
  hasSubscribed,
}) => {
  return article ? (
    <ArticleTemplate
      article={article}
      articleBodySerialized={articleBodySerialized}
      estimatedReadingTime={estimatedReadingTime}
      hasSubscribed={hasSubscribed}
    />
  ) : null
}

export default ArticlePage
