import * as React from 'react'
import DefaultLayout from '@skillrecordings/react/dist/layouts'
import type {LayoutProps} from '@skillrecordings/react/dist/layouts'
import config from '../config'
import {first} from 'lodash'

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  meta,
  ...props
}) => {
  const defaultMeta = {
    title: config.defaultTitle,
    description: config.description,
    titleAppendSiteName: false,
    url: config.siteUrl,
    ogImage: first(config.openGraph.images),
  }

  return (
    <DefaultLayout {...props} meta={{...defaultMeta, ...meta}}>
      {children}
    </DefaultLayout>
  )
}

export default Layout
