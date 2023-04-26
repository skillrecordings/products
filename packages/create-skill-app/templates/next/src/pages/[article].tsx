import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {type Article, getAllArticles, getArticle} from 'lib/articles'
import ArticleTemplate from 'templates/article-template'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const article = await getArticle(params?.article as string)
  const mdx = await serializeMDX(article.body)
  return {
    props: {article, mdx},
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

const Article: React.FC<{article: Article; mdx: MDXRemoteSerializeResult}> = ({
  article,
  mdx,
}) => {
  return article ? <ArticleTemplate article={article} mdx={mdx} /> : null
}

export default Article
