import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'
import {getAllTips} from 'lib/tips'
import {first} from 'lodash'
import {prisma} from '@skillrecordings/database'
import * as React from 'react'
import {trpc} from 'trpc/trpc.client'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  // TODO: check for session, redirect to login if not with return url

  const deviceVerification = await prisma.deviceVerification.findFirst({
    where: {
      userCode: query?.user_code as string,
    },
  })

  return {
    props: {
      userCode: query?.user_code,
    },
  }
}

export default function Activate({userCode}: {userCode: string}) {
  const verifyDeviceMutation = trpc.deviceVerification.verify.useMutation()

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
                console.log(data)
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
