import React from 'react'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import PortableTextArticleTemplate from 'templates/portable-text-article-template'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import * as serverCookie from 'cookie'
import groq from 'groq'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {checkIfConvertkitSubscriber} from '@skillrecordings/convertkit-react-ui'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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

function getConvertkitFromCookieHeaders(serverCookies: string = '') {
  return CK_SUBSCRIBER_KEY
    ? serverCookie.parse(serverCookies)[CK_SUBSCRIBER_KEY]
    : ''
}

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
  if (isEmpty(find(allArticles, {slug: params?.article as string}))) {
    return {
      notFound: true,
    }
  }

  if (currentArticle?.subscribersOnly && !hasSubscribed) {
    // only get preview if for subscribers only AND viewer hasn't subscribed (no ckId cookie)
    const data = await sanityClient.fetch(previewArticleQuery, {
      slug: currentArticle?.slug,
    })
    return {
      props: {article: data, hasSubscribed: false},
    }
  } else {
    // otherwise get the full article
    const data = await sanityClient.fetch(fullArticleQuery, {
      slug: currentArticle?.slug,
    })
    return {
      props: {article: data, hasSubscribed: true},
    }
  }
}

type ArticlePageProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticlePage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  article,
  hasSubscribed,
}) => {
  return (
    <PortableTextArticleTemplate
      article={article}
      hasSubscribed={hasSubscribed}
    />
  )
}

export default ArticlePage
