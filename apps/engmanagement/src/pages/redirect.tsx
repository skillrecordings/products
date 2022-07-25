import {useRouter} from 'next/router'
import * as React from 'react'
import Layout from '../layouts'

const Redirect = () => {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/learn')
  }, [])
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
