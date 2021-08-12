import * as React from 'react'
import Layout from '../layouts'

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
