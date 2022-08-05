import {StaticImageData} from 'next/image'

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
  title?: string
  url?: string
  description?: string
  published?: string
  image?: StaticImageData
  client?: Contributor
  titleAppendSiteName?: boolean
  ogImage?: {
    url: string
    alt: string
  }
  type?: string
  date?: string
  article?: {publishedTime: string}
}

export type LayoutProps = {
  meta?: MetaTags
  noIndex?: boolean
  className?: string
  nav?: boolean
  footer?: React.ReactElement | null
  children?: any
}
