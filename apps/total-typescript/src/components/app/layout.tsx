import {NextSeo} from '@skillrecordings/next-seo'
import cx from 'classnames'
import Footer from 'components/app/footer'
import Navigation from 'components/app/navigation'
import isNull from 'lodash/isNull'
import {usePathname} from 'next/navigation'
import {FunctionComponent} from 'react'
import {ClientComponentLayout} from './client-components-layout'
import {LayoutProps} from './types'

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  nav,
  footer,
}) => {
  const pathname = usePathname()
  const {
    title,
    description,
    titleAppendSiteName = true,
    url = `${process.env.NEXT_PUBLIC_URL}${pathname}`,
    type = 'website',
    ogImage = {
      url: `${process.env.NEXT_PUBLIC_URL}/card@2x.png`,
    },
    date,
  } = meta || {}

  return (
    <div className="relative">
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE}`
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
      <ClientComponentLayout>
        {nav ? nav : isNull(nav) ? null : <Navigation />}
        <div
          className={cx(
            'flex h-full min-h-screen flex-grow flex-col ',
            className,
          )}
        >
          {children}
        </div>
        {footer ? footer : isNull(footer) ? null : <Footer />}
      </ClientComponentLayout>
    </div>
  )
}

export default Layout
