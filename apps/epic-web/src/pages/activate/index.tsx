import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'
import {getAllTips} from 'lib/tips'
import {first} from 'lodash'
import {prisma} from '@skillrecordings/database'
import * as React from 'react'
import {trpc} from 'trpc/trpc.client'
import {getToken} from 'next-auth/jwt'

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
  return (
    <div>
      <h1>Activate</h1>
      <div>{userCode}</div>
      <button
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
        className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        verify device
      </button>
    </div>
  )
}
