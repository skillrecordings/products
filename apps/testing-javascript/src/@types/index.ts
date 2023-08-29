import {StaticImageData} from 'next/legacy/image'
import type {PortableTextBlock} from '@portabletext/types'
import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'
import type {Module as ModuleWithoutDuration} from '@skillrecordings/skill-lesson/schemas/module'

// https://www.totaltypescript.com/concepts/the-prettify-helper
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Module = Prettify<
  ModuleWithoutDuration & {
    durationInSeconds: string
  }
>

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
  name: string
  title: string
  image: {
    url: string
    alt: string
  }
}

export type FaqProps = {
  question: string
  answer: PortableTextBlock
}

export type InterviewProps = {
  isMultiple: boolean
  description: PortableTextBlock
  title: string
  slug: {
    current: string
  }
  portraits: {
    image1: {
      alt: string
      url: string
    }
    image2?: {
      alt: string
      url: string
    }
  }
}
