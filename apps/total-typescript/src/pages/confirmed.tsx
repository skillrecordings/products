import React from 'react'
import Layout from '@/components/app/layout'
import {Signature} from './confirm'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

const ConfirmedSubscriptionPage = () => {
  const {data: session} = useSession()
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout footer={null}>
      <main className="flex flex-grow flex-col items-center justify-center px-5 py-32">
        <Image />
        <div className="flex max-w-lg flex-col items-center text-center font-light">
          <h1 className="text-balance pb-5 text-3xl font-semibold lg:text-4xl">
            Thanks for confirming your email address.
          </h1>
          <p className="mx-auto text-balance pb-10 font-normal leading-relaxed text-slate-300 sm:text-lg">
            You're all set to receive emails from{' '}
            {process.env.NEXT_PUBLIC_SITE_TITLE}.
          </p>
          {!session && (
            <Button
              asChild
              size="lg"
              onClick={() => {
                track('clicked log in', {
                  location: 'confirmed subscription',
                })
              }}
              className="h-12 bg-gradient-to-tr from-[#4BCCE5] to-[#8AF7F1] text-base font-semibold"
            >
              <Link href="/login?prefill=true">Continue to Login</Link>
            </Button>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return null
}
