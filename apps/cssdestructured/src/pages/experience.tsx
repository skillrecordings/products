import * as React from 'react'
import {useConvertkit} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import Layout from 'components/app/layout'

const Experience = () => {
  const router = useRouter()
  const {subscriber} = useConvertkit()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2710250:
        return 'looking for your first job'
      case 2710261:
        return 'a junior developer'
      case 2710262:
        return 'a senior developer'
      default:
        return 'a developer'
    }
  }

  React.useEffect(() => {
    if (tagId && !isEmpty(subscriber)) {
      axios
        .post('/api/convertkit/subscribe', {
          ...subscriber,
          tag: tagId,
          email: subscriber?.email_address,
        })
        .catch((err) => console.log(err))
    }
  }, [tagId, subscriber])

  return (
    <Layout>
      <div className="prose dark:prose-dark prose-lg max-w-md mx-auto py-24">
        <h1>Thanks!</h1>
        <p>
          Thanks for letting me know you're {message(tagId)}.<br />
          I'm sure you'll find something helpful in CSS Destructured!
        </p>
        <p>
          Watch your inbox for more,
          <br />
          Emma
        </p>
      </div>
    </Layout>
  )
}

export default Experience
