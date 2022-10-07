import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {type Article, getAllArticles, getArticle} from 'lib/articles'
import ArticleTemplate from 'templates/article-template'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const article = await getArticle(params?.article as string)

  return {
    props: {article},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles()
  const paths = articles.map((article: Article) => ({
    params: {article: article.slug},
  }))
  return {paths, fallback: false}
}

const Article: React.FC<{article: Article}> = ({article}) => {
  return article ? <ArticleTemplate article={article} /> : null
}

export default Article
