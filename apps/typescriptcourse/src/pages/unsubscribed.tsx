import * as React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'

const Unsubscribed = () => {
  const router = useRouter()
  const sequence = String(router.query?.sequence)
  const message = (sequence: string) => {
    switch (sequence) {
      case 'course01': // unsubscribed: email course
        return `${process.env.NEXT_PUBLIC_SITE_TITLE} email course`
      case 'workshops': // unsubscribed: live workshop info
        return `${process.env.NEXT_PUBLIC_SITE_TITLE} workshop offers`
      default:
        return `${process.env.NEXT_PUBLIC_SITE_TITLE} email lis`
    }
  }

  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5">
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            Unsubscribed
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            You've been removed from the {message(sequence)} and won't receive
            any more emails about it.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default Unsubscribed
