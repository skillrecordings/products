import * as React from 'react'
import Layout from '../components/app/layout'

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
