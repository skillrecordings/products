import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import Footer from './footer'
import localFont from 'next/font/local'
import {Toaster} from 'react-hot-toast'

const ffNortHeadline = localFont({
  src: [
    {
      path: '../../styles/fonts/01014c8b-da7d-49ab-a0c3-76f7de7ba336.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
})

const ffNort = localFont({
  src: [
    {
      path: '../../styles/fonts/a5f309ff-aa84-4aa6-9fd8-ca3feedb9265.woff2',
      weight: '300', // light
      style: 'normal',
    },
    {
      path: '../../styles/fonts/44ae4887-8a35-45d6-b028-7516f3841c00.woff2',
      weight: '300', // light
      style: 'italic',
    },
    {
      path: '../../styles/fonts/7b3ac33d-e084-4112-9256-a658b46fd6d2.woff2',
      weight: '400', // regular
      style: 'normal',
    },
    {
      path: '../../styles/fonts/e905a5b7-87ed-4c15-9f2b-5be5f7f61a2a.woff2',
      weight: '400', // regular
      style: 'italic',
    },
    {
      path: '../../styles/fonts/034a240e-f841-4345-959f-cf75a47c0116.woff2',
      weight: '500', // medium
      style: 'normal',
    },
    {
      path: '../../styles/fonts/e446908b-705f-4bf8-8d3a-ad71a1ceebdf.woff2',
      weight: '500', // medium
      style: 'italic',
    },
    {
      path: '../../styles/fonts/42c249a8-2cd5-4153-bc57-d3b48f1ea489.woff2',
      weight: '600', // bold
      style: 'normal',
    },
    {
      path: '../../styles/fonts/f7ead13e-b410-4a9d-9c46-5b748bf9684f.woff2',
      weight: '600', // bold
      style: 'italic',
    },
    {
      path: '../../styles/fonts/5a128de3-9adf-4965-9593-eb12c999db47.woff2',
      weight: '700', // black
      style: 'normal',
    },
    {
      path: '../../styles/fonts/9126e06d-5332-4336-9419-4ba4b0e23796.woff2',
      weight: '700', // black
      style: 'italic',
    },
  ],
  variable: '--font-sans',
})

type LayoutProps = {
  meta?: NextSeoProps & {titleAppendSiteName?: boolean}
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  withFooter?: boolean
  navigationProps?: {
    className?: string
  }
  footerProps?: {
    className?: string
  }
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  withFooter = false,
  navigationProps,
  footerProps,
}) => {
  const {
    title,
    description,
    openGraph,
    titleAppendSiteName = true,
    defaultTitle = process.env.NEXT_PUBLIC_SITE_TITLE,
  } = meta || {}

  const {url} = openGraph || {}

  return (
    <div
      className={`relative ${ffNort.variable} font-sans ${ffNortHeadline.variable}`}
    >
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE}`
            : undefined
        }
        openGraph={openGraph}
        canonical={url}
        noindex={noIndex}
      />
      <Toaster position="top-center" />
      {withNavigation && <Navigation {...navigationProps} />}
      <div
        className={twMerge(
          'flex h-full min-h-[calc(100vh-64px)] flex-grow flex-col',
          className,
        )}
      >
        {children}
      </div>
      {withFooter && <Footer {...footerProps} />}
    </div>
  )
}

export default Layout
