import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {type Article, getAllArticles, getArticle} from 'lib/articles'
import ArticleTemplate from 'templates/article-template'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import readingTime from 'reading-time'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const article = await getArticle(params?.article as string)

  if (!article) {
    return {
      notFound: true,
    }
  }

  const articleBodySerialized = await serializeMDX(article.body, {
    syntaxHighlighterOptions: {
      theme: 'material-palenight',
      showCopyButton: true,
    },
  })
  const estimatedReadingTime = readingTime(article.body)

  return {
    props: {
      article,
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

const Article: React.FC<{
  article: Article
  articleBodySerialized: MDXRemoteSerializeResult
  estimatedReadingTime: number
}> = ({article, articleBodySerialized, estimatedReadingTime}) => {
  return article ? (
    <ArticleTemplate
      article={article}
      articleBodySerialized={articleBodySerialized}
      estimatedReadingTime={estimatedReadingTime}
    />
  ) : null
}

export default Article
