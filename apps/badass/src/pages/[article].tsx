import React from 'react'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import ArticleTemplate from 'templates/article-template'
import groq from 'groq'

const previewArticleQuery = groq`*[_type == "article" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    'body': preview,
    subscribersOnly,
    date,
    description,
    ogImage {
      url,
    },
    cta {
      body,
      ckFormId,
      actionLabel
    }
    }`
const fullArticleQuery = groq`*[_type == "article" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  body,
  subscribersOnly,
  date,
  description,
  "video": video{
    "muxId": muxAsset.muxPlaybackId,
    "transcript": castingwords.transcript,
  },
  ogImage{
    url
  },
  cta {
      body,
      ckFormId,
      actionLabel
    }
  }`
const allArticlesQuery = groq`*[_type == "article"]{
  "slug": slug.current,
  subscribersOnly
  }`

export const getStaticProps: GetStaticProps = async ({params}) => {
  const article = await sanityClient.fetch(fullArticleQuery, {
    slug: params?.article,
  })

  return {
    props: {
      article,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

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
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticlePage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  article,
  hasSubscribed = true,
}) => {
  return <ArticleTemplate article={article} hasSubscribed={hasSubscribed} />
}

export default ArticlePage
