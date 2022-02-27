import * as React from 'react'
import DefaultLayout from '@skillrecordings/react/dist/layouts'
import type {LayoutProps} from '@skillrecordings/react/dist/layouts'
import config from '../config'
import {first} from 'lodash'
import Navigation from './navigation'

const Layout: React.FC<LayoutProps> = ({children, meta, ...props}) => {
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
    >
      {children}
    </DefaultLayout>
  )
}

export default Layout
