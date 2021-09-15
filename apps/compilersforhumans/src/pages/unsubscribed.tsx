import React from 'react'
import Layout from 'layouts'
import config from '../config'
import {useRouter} from 'next/router'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import {useConvertkit} from '@skillrecordings/convertkit'

const Unsubscribed = () => {
  const router = useRouter()
  const {subscriber} = useConvertkit()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2622386:
        return 'Compilers for Humans Email Course'
      default:
        return 'Compilers For Humans email list'
    }
  }

  React.useEffect(() => {
    if (tagId && !isEmpty(subscriber)) {
      axios
        .post('/api/convertkit/subscribe', {...subscriber, tag: tagId})
        .catch((err) => console.log(err))
    }
  }, [tagId, subscriber])

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
