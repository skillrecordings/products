import {StaticImageData} from 'next/legacy/image'
import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'

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
  noNav?: boolean
  navClassName?: string
  footer?: React.ReactElement | null
  defaultCoupon?: DefaultCoupon
  children?: any
}

export type TestimonialProps = {
  text: string
  author: {
    name: string
    title: string
    imageUrl: string
  }
}
