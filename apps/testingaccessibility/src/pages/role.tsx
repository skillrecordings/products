import * as React from 'react'
import {useConvertkit} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import Layout from 'components/app/layout'

const JobRole = () => {
  const router = useRouter()
  const {subscriber} = useConvertkit()
  const tagId = Number(router.query?.tag)

  const message = (tagId: number) => {
    switch (tagId) {
      case 2982275:
        return 'a developer'
      case 2982283:
        return 'in QA'
      case 2982286:
        return 'interested in Testing Accessibility'
      case 3080794:
        return 'a manager'
      default:
        return 'interested in Testing Accessibility'
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
      <main className="pt-8 pb-24 h-full flex flex-col items-center justify-center flex-grow">
        <header className="text-center flex flex-col items-center justify-center">
          <h1 className="flex items-center sm:text-4xl text-3xl font-semibold pb-5">
            Thanks!
          </h1>
        </header>
        <div className="prose sm:prose-lg max-w-screen-sm mx-auto px-5 leading-tight text-center">
          <p>Thanks for letting me know you're {message(tagId)}.</p>
          <p>
            Watch your inbox for more,
            <br />
            Marcy
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default JobRole
