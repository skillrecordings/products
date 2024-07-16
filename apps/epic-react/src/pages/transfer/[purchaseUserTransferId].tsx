import * as React from 'react'
import {type GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from '@/components/app/layout'
import {
  getSdk,
  type Purchase,
  type PurchaseUserTransfer,
  type User,
} from '@skillrecordings/database'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {trpc} from '../../trpc/trpc.client'
import {useRouter} from 'next/router'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const purchaseUserTransferId = params?.purchaseUserTransferId as string
  const token = await getToken({req})
  const {getPurchaseUserTransferById} = getSdk()
  const purchaseUserTransfer = await getPurchaseUserTransferById({
    id: purchaseUserTransferId,
  })

  if (!purchaseUserTransfer || !token) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      purchaseUserTransfer:
        convertToSerializeForNextResponse(purchaseUserTransfer),
    },
  }
}

const Welcome = ({
  purchaseUserTransfer,
}: {
  purchaseUserTransfer: PurchaseUserTransfer & {
    purchase: Purchase
    sourceUser: User
    targetUser: User | null
  }
}) => {
  const utils = trpc.useContext()
  const router = useRouter()
  const acceptTransferMutation = trpc.purchaseUserTransfer.accept.useMutation({
    onSettled: async (data, error, variables, context) => {
      await utils.purchaseUserTransfer.invalidate()
      data && router.push(`/welcome?purchaseId=${data?.newPurchase.id}`)
    },
  })
  const {data} = trpc.purchaseUserTransfer.byId.useQuery({
    id: purchaseUserTransfer.id,
  })

  return (
    <Layout
      meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      footer={null}
    >
      <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 py-24 sm:py-32">
        {data?.transferState === 'INITIATED' && (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <h1 className="text-center text-3xl font-bold">
              👋 Welcome to {process.env.NEXT_PUBLIC_SITE_TITLE}
            </h1>
            <h2 className="text-center text-xl font-semibold">
              You've been invited by{' '}
              {data?.sourceUser?.name || data?.sourceUser?.email || ''} to join{' '}
              {process.env.NEXT_PUBLIC_SITE_TITLE}
            </h2>
            <button
              onClick={() => {
                data &&
                  acceptTransferMutation.mutate({
                    purchaseUserTransferId: data?.id,
                  })
              }}
              className="bg-brand-red relative flex flex-shrink-0 items-center justify-center rounded-full px-5 py-2 font-semibold shadow-2xl shadow-cyan-900/50 transition hover:brightness-110 focus-visible:ring-white"
              disabled={!data}
            >
              accept this transfer
            </button>
            <p className="text-center text-xs">
              By accepting this transfer you are agreeing to the{' '}
              <Link className="font-semibold hover:underline" href="/privacy">
                terms and conditions of {process.env.NEXT_PUBLIC_SITE_TITLE}
              </Link>
              .
            </p>
          </div>
        )}
        {data?.transferState === 'COMPLETED' && (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <h1 className="text-center text-3xl font-bold">
              Purchase Transfer Completed
            </h1>
            <h2 className="text-center text-xl font-semibold">
              The license transfer from
              {data?.sourceUser?.name || data?.sourceUser?.email || ''} has been
              completed.
            </h2>
          </div>
        )}
        {data?.transferState === 'CANCELED' && (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <h1 className="text-center text-3xl font-bold">
              Purchase Transfer Canceled
            </h1>
            <p className="text-center">
              The license transfer from{' '}
              <a
                className="font-semibold hover:underline"
                href={`mailto:${data?.sourceUser?.email}`}
              >
                {data?.sourceUser?.email}
              </a>{' '}
              has been canceled. Please contact them with any questions.
            </p>
          </div>
        )}
      </main>
    </Layout>
  )
}

type PurchaseTransferFormData = {
  email: string
}

export default Welcome
