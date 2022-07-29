import React from 'react'
import * as THREE from 'three'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import ArticleTemplate from 'templates/article-template'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import groq from 'groq'
import {checkIfConvertkitSubscriber} from '@skillrecordings/convertkit'
import {getArticle} from 'lib/articles'

const allArticlesQuery = groq`*[_type == "article"]{
  "slug": slug.current,
  }`

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params} = context
  const hasSubscribed = await checkIfConvertkitSubscriber(context)

  const allArticles = await sanityClient.fetch(allArticlesQuery)

  // find current article based on the slug
  const currentArticle: {slug: string; subscribersOnly: boolean} | undefined =
    find(allArticles, {
      slug: params?.article as string,
    })

  // if the article doesn't exist
  if (
    isEmpty(find(allArticles, {slug: params?.article as string})) ||
    !currentArticle
  ) {
    return {
      notFound: true,
    }
  }

  const article = await getArticle(currentArticle?.slug)

  return {
    props: {article},
  }
}

type ArticlePageProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticlePage: React.FC<ArticlePageProps> = ({article, hasSubscribed}) => {
  return <ArticleTemplate article={article} hasSubscribed={hasSubscribed} />
}

export default ArticlePage
