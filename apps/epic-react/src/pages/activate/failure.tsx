import * as React from 'react'
import {useRouter} from 'next/router'
import {GrStatusWarning} from 'react-icons/gr'
import Balancer from 'react-wrap-balancer'
import {XIcon} from '@heroicons/react/outline'
import {XCircleIcon} from '@heroicons/react/solid'
import Layout from '@/components/app/layout'

export default function ActivateFailure() {
  const router = useRouter()

  const {message = 'Unable to verify.'} = router.query

  return (
    <Layout meta={{title: 'Device Activation Failed'}}>
      <main className="mx-auto flex w-full max-w-lg flex-grow flex-col items-center justify-center pb-24 pt-16">
        <div className="flex w-full flex-col items-center rounded p-5 text-center">
          <XCircleIcon className="mb-5 h-10 w-10 text-rose-600 dark:text-rose-400" />
          <h1 className="text-2xl font-bold sm:text-3xl">
            Device Activation Failed
          </h1>
          <p className="w-full py-4 text-gray-600 dark:text-gray-400">
            <Balancer>{message} Please try again.</Balancer>
          </p>
        </div>
      </main>
    </Layout>
  )
}
