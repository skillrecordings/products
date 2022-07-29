import * as React from 'react'
import DefaultLayout from '@skillrecordings/react/dist/layouts'
import type {LayoutProps} from '@skillrecordings/react/dist/layouts'
import config from '../config'
import {first} from 'lodash'
import Navigation from './navigation'

const Layout: React.FC<
  React.PropsWithChildren<LayoutProps & {withFooter?: boolean}>
> = ({children, withFooter, meta, ...props}) => {
  const defaultMeta = {
    title: config.defaultTitle,
    description: config.description,
    titleAppendSiteName: false,
    url: config.siteUrl,
    ogImage: first(config.openGraph.images),
  }

  return (
    <DefaultLayout
      {...props}
      meta={{...defaultMeta, ...meta}}
      Navigation={Navigation}
      Footer={null as any}
    >
      {children}
    </DefaultLayout>
  )
}

export default Layout
