import React from 'react'
import {getArticle} from 'lib/articles'
import {GetServerSideProps} from 'next'
import {SanityDocument} from '@sanity/client'
import ArticleTemplate from 'templates/article-template'

export const getServerSideProps: GetServerSideProps = async (req) => {
  const {article: slug} = req.query
  const article = await getArticle(`${slug}`)

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {article},
  }
}

export type ArticlePageProps = {
  article: SanityDocument
}

const ArticlePage: React.FC<ArticlePageProps> = ({article}) => {
  return <ArticleTemplate article={article} />
}

export default ArticlePage
