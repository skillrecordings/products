import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import {Inter} from 'next/font/google'
import {Toaster} from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '600', '800'],
})

type LayoutProps = {
  meta?: NextSeoProps & {
    titleAppendSiteName?: boolean
    url?: string
    type?: string
    ogImage?: {url: string; alt: string}
    date?: string
  }
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  navigationProps?: {
    className?: string
    navChildren: React.ReactNode
  }
  footerProps?: {
    className?: string
  }
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  navigationProps,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = true,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}

  return (
    <div
      className={`relative ${inter.variable} font-sans text-text antialiased`}
      id="layout"
    >
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE} by ${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
            : undefined
        }
        openGraph={{
          title,
          description,
          type,
          url,
          images: ogImage ? [ogImage] : undefined,
          article: {
            publishedTime: date,
          },
        }}
        canonical={url}
        noindex={noIndex}
      />
      <Toaster position="top-center" />
      {withNavigation && <Navigation {...navigationProps} />}
      <div
        className={twMerge(
          'mt-[57px] flex min-h-[calc(100svh-57px)] flex-grow flex-col sm:mt-[61px] sm:min-h-[calc(100svh-61px)]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
