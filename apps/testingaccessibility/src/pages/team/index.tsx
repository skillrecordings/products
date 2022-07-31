import React from 'react'
import Layout from 'components/app/layout'
import {find, get, isNull, isString} from 'lodash'
import {serialize} from 'utils/prisma-next-serializer'
import {GetServerSideProps} from 'next'
import {getPurchasedProduct} from 'server/get-purchased-product'
import InviteTeam from 'components/team'
import {UserGroupIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {getPurchaseDetails} from '../../lib/purchases'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '@skillrecordings/honeycomb-tracer'
import {getCurrentAbility} from '../../server/ability'
import {getToken} from 'next-auth/jwt'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  const token = await getToken({req})
  const ability = getCurrentAbility(token as any)

  if (ability.can('view', 'Team')) {
    const {purchases} = await getPurchasedProduct(req)
    const purchaseId = get(
      find(purchases, (purchase: any) => !isNull(purchase.bulkCoupon)),
      'id',
    )

    if (token && isString(purchaseId) && isString(token?.sub)) {
      const {purchase, existingPurchase, availableUpgrades} =
        await getPurchaseDetails(purchaseId, token.sub)
      return purchase
        ? {
            props: {
              purchase: serialize(purchase),
              existingPurchase,
              availableUpgrades,
            },
          }
        : {
            redirect: {
              destination: `/`,
              permanent: false,
            },
          }
    }
  }

  return {
    redirect: {
      destination: `/`,
      permanent: false,
    },
  }
}

type TeamPageProps = {
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  availableUpgrades: {upgradableTo: {id: string; name: string}}[]
}

const TeamPage: React.FC<React.PropsWithChildren<TeamPageProps>> = ({
  purchase,
  existingPurchase,
  availableUpgrades,
}) => {
  const {data: session} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState<any>(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  return (
    <Layout
      meta={{title: 'Invite your team to Testing Accessibility'}}
      className="bg-green-700 bg-noise"
    >
      <main className="flex flex-col flex-grow items-center justify-center py-16 mx-auto w-full p-5">
        <div className="bg-white rounded-lg max-w-lg w-full">
          <div className="sm:px-8 px-5 sm:py-8 py-5 bg-white rounded-lg">
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <UserGroupIcon className="w-5 text-green-500" /> Invite your team
            </h1>
            <InviteTeam
              session={session}
              purchase={purchase}
              existingPurchase={existingPurchase}
              setPersonalPurchase={setPersonalPurchase}
            />
            {personalPurchase && (
              <div className="flex sm:flex-row flex-col-reverse items-center justify-between pt-5 mt-5 border-t border-gray-100 sm:gap-10 gap-5">
                <Link href="/learn">
                  <a className="flex-shrink-0 border border-green-500 transition text-green-600 px-4 py-2 hover:bg-green-600/5 rounded-md font-semibold">
                    Start Learning
                  </a>
                </Link>
                <p className="font-semibold leading-tight">
                  You've claimed one of the seats yourself.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default TeamPage
