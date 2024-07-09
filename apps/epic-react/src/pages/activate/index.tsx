import {motion} from 'framer-motion'
import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'
import * as React from 'react'
import {getToken} from 'next-auth/jwt'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import Layout from '@/components/app/layout'
import {trpc} from '@/trpc/trpc.client'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getToken({req})

  const unAuthedCallbackUrl = `/activate%3Fuser_code=${query?.user_code}`

  if (!sessionToken) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${unAuthedCallbackUrl}&message=You must be logged in to activate your device.`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      userCode: query?.user_code,
    },
  }
}

export default function Activate({userCode}: {userCode: string}) {
  const verifyDeviceMutation = trpc.deviceVerification.verify.useMutation()
  const router = useRouter()
  const [animate, setAnimate] = React.useState(false)
  return (
    <Layout
      meta={{
        title: 'Device Activation',
      }}
    >
      <main className="mx-auto flex w-full max-w-lg flex-grow flex-col items-center justify-center pb-24 pt-16">
        <div className="flex w-full flex-col items-center rounded p-5 text-center">
          <Fingerprint animate={animate} />
          <h1 className="text-2xl font-bold sm:text-3xl">
            Device Confirmation
          </h1>
          <p className="py-4 text-gray-600 dark:text-gray-400">
            Please confirm this is the code displayed in your Workshop App
          </p>
          <div className="dark:bg-black/75 w-full rounded-md border px-5 py-3 text-lg font-semibold dark:border-transparent">
            {userCode}
          </div>
          <Button
            onMouseOver={() => {
              setAnimate(true)
            }}
            onMouseOut={() => {
              setAnimate(false)
            }}
            onClick={async () => {
              verifyDeviceMutation.mutate(
                {userCode},
                {
                  onSettled: (data) => {
                    switch (data?.status) {
                      case 'device-verified':
                        router.push('/activate/success')
                        break
                      case 'already-verified':
                        router.push(
                          '/activate/failure?message=Device already verified.',
                        )
                        break
                      case 'code-expired':
                        router.push('/activate/failure?message=Code expired.')
                        break
                      case 'no-verification-found':
                        router.push(
                          '/activate/failure?message=No verification found.',
                        )
                        break
                    }
                  },
                },
              )
            }}
            className="mt-8 font-semibold transition hover:brightness-110"
          >
            Confirm Device
          </Button>
        </div>
      </main>
    </Layout>
  )
}

const Fingerprint: React.FC<{animate: boolean}> = ({animate}) => {
  return (
    <div className="relative mb-5 flex items-center justify-center">
      <motion.div
        animate={{
          scale: animate ? 1 : 0,
        }}
        transition={{
          duration: 1,
          type: 'spring',
          bounce: 0.25,
        }}
        className="absolute h-10 w-10 rounded-full bg-blue-500 mix-blend-overlay dark:bg-blue-400 dark:mix-blend-overlay"
      />
      <svg
        className={cn('h-10 w-10 text-gray-400 dark:text-gray-500')}
        aria-hidden
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none">
          <path
            d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67a.49.49 0 0 1-.44.28zM3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 0 1-.12.7c-.23.16-.54.11-.7-.12a9.388 9.388 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94-1.7 0-3.08-1.32-3.08-2.94 0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  )
}
