import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'

export type LayoutProps = {
  meta?: {
    title?: string
    description?: string
    titleAppendSiteName?: boolean
    url?: string
    type?: string
    ogImage?: {
      url: string
    }
    date?: string
  }
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  defaultCoupon?: DefaultCoupon
  children?: React.ReactNode
}
