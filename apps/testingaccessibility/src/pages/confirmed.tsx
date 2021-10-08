import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import {useConvertkit} from '@skillrecordings/convertkit'

const Confirmed = () => {
  const router = useRouter()
  const {subscriber} = useConvertkit()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2304749: // Trigger: TA Workshop Interest form (email course)
        return 'Testing Accessibility email course'
      case 1949406: // workshop-interest
        return 'Testing Accessibility workshop'
      default:
        return 'Testing Accessibility'
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
        <h1>You're Confirmed!</h1>
        <p>
          Thanks for confirming your email address– you're all set to receive{' '}
          {message(tagId)} emails from me.
        </p>
        <p>
          <em>Thanks,</em>
          <br />
          <em>Marcy</em>
        </p>
      </div>
    </Layout>
  )
}

export default Confirmed
