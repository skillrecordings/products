import React from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts'
import Image from 'next/image'

const Confirm = () => {
  const router = useRouter()
  const articleTitle = router.query.title
  const emailAddress = router.query.email

  return (
    <Layout hideNav meta={{title: 'Confirm your email'}}>
      <div className="max-w-2xl text-center space-y-5 mx-auto py-24 px-5">
        <Image
          src={'/images/email-notification.svg'}
          width={100}
          height={100}
        />
        <h1 className="text-orange-200 uppercase font-semibold tracking-wide">
          {articleTitle
            ? 'Check your inbox'
            : 'Just one last step and you are signed up...'}
        </h1>
        <h2 className="font-medium text-3xl">
          {articleTitle && emailAddress ? (
            <>
              A link to access{' '}
              {articleTitle ? (
                <>
                  <b>{articleTitle}</b> article
                </>
              ) : (
                'the article'
              )}{' '}
              just got sent{' '}
              {!emailAddress ? (
                '.'
              ) : (
                <>
                  to <b>{emailAddress}</b>.
                </>
              )}
            </>
          ) : (
            `Please check your inbox for an email that just got sent. You'll need to click the confirmation link to receive any further emails.`
          )}
        </h2>
        <p className="opacity-80 prose prose-lg">
          If you don't see the email after a few minutes, you might check your
          spam folder or other filters and add{' '}
          <code>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</code> to your contacts.
        </p>
        <div className="flex flex-col pt-6 text-gray-200 text-lg">
          <i>Thanks,</i>
          <div>
            <Image
              width={100}
              height={100}
              alt="Sarah's signature (made up by a designer)"
              aria-hidden="true"
              src={'/images/signature.svg'}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Confirm
