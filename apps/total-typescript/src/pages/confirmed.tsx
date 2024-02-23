import React from 'react'
import Layout from '@/components/app/layout'
import {Signature} from './confirm'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout footer={null}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="py-8 font-text text-4xl font-bold lg:text-5xl">
            You're Signed Up!
          </h1>
          <p className="mx-auto pb-8 font-medium leading-relaxed text-slate-300 sm:text-xl">
            Thanks for confirming your email address — you're all set to receive{' '}
            emails from me about {process.env.NEXT_PUBLIC_SITE_TITLE}.
          </p>
          <Button
            asChild
            size="lg"
            onClick={() => {
              track('clicked log in', {
                location: 'confirmed subscription',
              })
            }}
            className="w-full max-w-[150px] text-lg font-semibold"
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return null
}
