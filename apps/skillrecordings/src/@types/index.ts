import * as React from 'react'

export type MetaTags = {
  title: string
  url: string
  description: string
  titleAppendSiteName?: boolean
  ogImage?: {
    url: string
    alt: string
  }
}

export type DefaultLayoutProps = {
  meta: MetaTags
}

export type CaseStudyTemplateProps = {
  meta: MetaTags
  headerImage?: {
    url: string
    alt: string
  }
}

export type ClientProps = {
  name: string
  label: string
  image: {
    url: string
  }
  links: [
    {
      label: string
      url: string
    },
  ]
}
