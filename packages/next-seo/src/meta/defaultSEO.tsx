import Head from 'next/head'
import React, {Component} from 'react'
import buildTags from './buildTags'

import {DefaultSeoProps} from '../types'
const DefaultSEO = (props: DefaultSeoProps) => {
  const {
    title,
    titleTemplate,
    defaultTitle,
    dangerouslySetAllPagesToNoIndex = false,
    dangerouslySetAllPagesToNoFollow = false,
    description,
    canonical,
    facebook,
    openGraph,
    additionalMetaTags,
    twitter,
    defaultOpenGraphImageWidth,
    defaultOpenGraphImageHeight,
    defaultOpenGraphVideoWidth,
    defaultOpenGraphVideoHeight,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags,
    robotsProps,
  } = props

  return (
    <Head>
      {buildTags({
        title,
        titleTemplate,
        defaultTitle,
        dangerouslySetAllPagesToNoIndex,
        dangerouslySetAllPagesToNoFollow,
        description,
        canonical,
        facebook,
        openGraph,
        additionalMetaTags,
        twitter,
        defaultOpenGraphImageWidth,
        defaultOpenGraphImageHeight,
        defaultOpenGraphVideoWidth,
        defaultOpenGraphVideoHeight,
        mobileAlternate,
        languageAlternates,
        additionalLinkTags,
        robotsProps,
      })}
    </Head>
  )
}

export default DefaultSEO
