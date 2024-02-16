import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import serializeMdx from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'

import ArticleTemplate from 'templates/article-template'
import {Article, getAllArticles, getArticle} from 'lib/articles'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const article = await getArticle(params?.article as string)
  const articleBodySerialized = article?.markdownBody
    ? await serializeMdx(article.markdownBody, {
        syntaxHighlighterOptions: {
          theme: 'one-dark-pro',
        },
      })
    : null

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article,
      articleBodySerialized,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const allArticles = await getAllArticles()

  const paths = allArticles.map((article: any) => {
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
}

const ArticlePage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  article,
  articleBodySerialized,
}) => {
  return (
    <ArticleTemplate
      article={article}
      articleBodySerialized={articleBodySerialized}
    />
  )
}

export default ArticlePage
