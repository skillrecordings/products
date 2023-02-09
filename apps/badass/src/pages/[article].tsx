import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import ArticleTemplate from 'templates/article-template'
import {Article, getAllArticles, getArticle} from 'lib/articles'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const article = await getArticle(params?.article as string)

  return {
    props: {
      article,
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
  hasSubscribed: boolean
}

const ArticlePage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  article,
  hasSubscribed = true,
}) => {
  return <ArticleTemplate article={article} hasSubscribed={hasSubscribed} />
}

export default ArticlePage
