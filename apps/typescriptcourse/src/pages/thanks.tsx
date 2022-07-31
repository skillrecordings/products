import * as React from 'react'
import Layout from '../components/app/layout'
import config from 'config'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import {fetchStripeCheckoutSession} from '@skillrecordings/stripe'
import {useViewer} from '@skillrecordings/viewer'

const ThanksPage = ({displayEmail}: any) => {
  const {refreshViewer} = useViewer()
  React.useEffect(() => {
    refreshViewer?.()
  }, [])

  const emailText =
    displayEmail && displayEmail !== 'undefined' ? `**${displayEmail}**` : ''
  const instructionText = `# Thank you for purchasing ${
    config.defaultTitle
  }. Please check your inbox.
${emailText ? `## ${emailText}` : ''}
As a final step to access the course you need
to check your inbox ${
    emailText ? `(${emailText})` : ''
  } where you will find an email from \`${
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL
  }\`
with a link to access your purchase and start learning.
`
  const TwitterIcon = () => (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#fff">
        <path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
      </g>
    </svg>
  )

  const tweet = `https://twitter.com/intent/tweet/?text=Just purchased ${config.siteUrl} by @${config.twitter.handle}`
  const Share = () => (
    <>
      <hr className="mt-8 border-gray-100 dark:border-gray-900" />
      <div className="py-8">
        <div className="pb-4 font-semibold">
          Please consider telling your friends about {config.siteUrl}, it would
          help me to get a word out. :)
        </div>
        <a
          href={tweet}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex items-center px-3 py-2 text-white rounded-md"
          style={{background: '#2c90dc'}}
        >
          <TwitterIcon />{' '}
          <span className="pl-2 font-medium">Share with your friends!</span>
        </a>
      </div>
    </>
  )

  return (
    <Layout meta={{title: 'Thank you!'}}>
      <div className="max-w-screen-sm mx-auto">
        <Markdown
          children={instructionText}
          className="prose dark:prose-dark lg:prose-lg max-w-none"
        />
        <Share />
      </div>
    </Layout>
  )
}

export default ThanksPage

export const getServerSideProps = async ({query}: any) => {
  const {email, session_id} = query
  let displayEmail = email
  if (!displayEmail && session_id) {
    const session = await fetchStripeCheckoutSession(session_id)
    displayEmail = get(session, 'customer.email')
  }

  return {
    props: {
      displayEmail: displayEmail || '',
    },
  }
}
