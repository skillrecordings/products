import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'

const Redirect = () => {
  return null
}

Redirect.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  )
}

export default Redirect
