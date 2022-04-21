import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import {useConvertkit} from '@skillrecordings/convertkit'
import {countBy} from 'lodash'

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

  const buttonClasses =
    'text-white text-lg inline-block sm:px-4 px-3 sm:py-2 py-1.5 bg-blue-700 rounded-full hover:bg-blue-800 transition outline-black'

  return (
    <Layout>
      <div className="md:py-16 py-10 flex flex-col max-w-screen-lg mx-auto justify-center text-center items-center h-full flex-grow">
        <div className="prose md:prose-lg max-w-md mx-auto ">
          <h1>You're Confirmed!</h1>
          <p>
            Thanks for confirming your email address– you're all set to receive{' '}
            {message(tagId)} emails from me.
          </p>
        </div>
        <fieldset className="max-w-md mx-auto md:px-8 md:py-8 py-6 px-4 rounded-lg border-2 border-gray-300 my-8">
          <legend className="md:text-xl text-lg font-bold bg-white px-2">
            Which of these sounds most like you?
          </legend>
          <div className="flex flex-col mx-auto md:space-y-4 space-y-2 text-white text-sm leading-6 max-w-xs text-center">
            <a className={buttonClasses} href="/role?tag=2982275">
              Developer
            </a>
            <a className={buttonClasses} href="/role?tag=2982283">
              QA
            </a>
            <a className={buttonClasses} href="/role?tag=2982286">
              Something Else
            </a>
          </div>
        </fieldset>
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
