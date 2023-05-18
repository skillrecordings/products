import Head from 'next/head'
import React, {Component} from 'react'
import buildTags from './buildTags'
import {NextSeoProps} from '../types'

const NextSEO = (props: NextSeoProps) => {
  const {
    title,
    noindex = false,
    nofollow,
    robotsProps,
    description,
    canonical,
    openGraph,
    facebook,
    twitter,
    additionalMetaTags,
    titleTemplate,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags,
  } = props

  return (
    <Head>
      {buildTags({
        title,
        noindex,
        nofollow,
        robotsProps,
        description,
        canonical,
        facebook,
        openGraph,
        additionalMetaTags,
        twitter,
        titleTemplate,
        mobileAlternate,
        languageAlternates,
        additionalLinkTags,
      })}
    </Head>
  )
}

export default NextSEO
