import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'

const Unsubscribed = () => {
  const router = useRouter()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2656297: // unsubscribed: ta email course
        return 'Testing Accessibility email course'
      case 2656298: // unsubscribed: live workshop info
        return 'Testing Accessibility live workshops list'
      default:
        return 'Testing Accessibility email list'
    }
  }

  return (
    <Layout>
      <div className="prose prose-lg max-w-md mx-auto py-24">
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
