import React from 'react'
import Layout from 'layouts'
import {useRouter} from 'next/router'

const Unsubscribed = () => {
  const router = useRouter()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2622386:
        return 'Compilers for Humans Email Course'
      default:
        return 'Compilers For Humans email list'
    }
  }

  return (
    <Layout>
      <div className="prose dark:prose-dark prose-lg max-w-md mx-auto py-24">
        <h1>Unsubscribed</h1>
        <p>
          You've been removed from the {message(tagId)} and won't receive any
          more emails about it.
        </p>
      </div>
    </Layout>
  )
}

export default Unsubscribed
