export type Contributor = {
  name: string
  label: string
  image: string
  links?: {
    url: string
    label: string
  }[]
}

export type MetaTags = {
  title: string
  url: string
  description: string
  published?: string
  image: StaticImageData
  client: Contributor
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
