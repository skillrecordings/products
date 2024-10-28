import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from '@/components/app/layout'
import {
  getSdk,
  Purchase,
  PurchaseUserTransfer,
  User,
} from '@skillrecordings/database'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {trpc} from '@/trpc/trpc.client'
import {useRouter} from 'next/router'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const purchaseUserTransferId = params?.purchaseUserTransferId as string
  const token = await getToken({req})
  const {getPurchaseUserTransferById, getUserById} = getSdk()
  const purchaseUserTransfer = await getPurchaseUserTransferById({
    id: purchaseUserTransferId,
  })

  const user = token?.sub ? await getUserById({where: {id: token.sub}}) : null

  if (!purchaseUserTransfer || !user) {
    return {
      notFound: true,
    }
  }

  const signedInAsTargetUser = user.id === purchaseUserTransfer.targetUserId

  return {
    props: {
      purchaseUserTransfer:
        convertToSerializeForNextResponse(purchaseUserTransfer),
      signedInAsTargetUser,
    },
  }
}

const Welcome = ({
  purchaseUserTransfer,
  signedInAsTargetUser,
}: {
  purchaseUserTransfer: PurchaseUserTransfer & {
    purchase: Purchase
    sourceUser: User
    targetUser: User | null
  }
  signedInAsTargetUser: boolean
}) => {
  const utils = trpc.useContext()
  const router = useRouter()

  const acceptTransferMutation = trpc.purchaseUserTransfer.accept.useMutation({
    // @ts-ignore
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
      survey={false}
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
            {signedInAsTargetUser ? (
              <>
                <button
                  onClick={() => {
                    data &&
                      acceptTransferMutation.mutate({
                        purchaseUserTransferId: data?.id,
                      })
                  }}
                  className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  disabled={!data}
                >
                  accept this transfer
                </button>
                <p className="text-center text-xs">
                  By accepting this transfer you are agreeing to the{' '}
                  <Link
                    className="font-semibold hover:underline"
                    href="/privacy"
                  >
                    terms and conditions of Total TypeScript
                  </Link>
                  .
                </p>
              </>
            ) : (
              <p className="text-center">
                In order to accept this invitation, you must be signed in as{' '}
                <span className="font-semibold underline">
                  {data?.targetUser?.email}
                </span>
                . Please sign in to the account tied to that email and revisit
                this URL to accept the transfer.
              </p>
            )}
          </div>
        )}
        {data?.transferState === 'COMPLETED' && (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <h1 className="text-center text-3xl font-bold">
              Purchase Transfer Completed
            </h1>
            <h2 className="text-center text-xl font-semibold">
              The license transfer from{' '}
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
