import React from 'react'
import Layout from 'components/app/layout'
import prisma from 'db'
import {get, last} from 'lodash'
import {serialize} from 'utils/prisma-next-serializer'
import {GetServerSideProps} from 'next'
import {getPurchasedProduct} from 'server/get-purchased-product'
import InviteTeam from 'components/team'
import {UserGroupIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {useSession} from 'next-auth/react'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const {purchases, token} = await getPurchasedProduct(req)

  if (purchases) {
    const purchaseId = get(last(purchases), 'id')

    if (purchaseId) {
      const allPurchases = await prisma.purchase.findMany({
        where: {
          userId: token?.sub,
        },
        select: {
          id: true,
          productId: true,
        },
      })
      const purchase = await prisma.purchase.findFirst({
        where: {
          id: purchaseId as string,
          userId: token?.sub,
        },
        select: {
          merchantChargeId: true,
          bulkCoupon: {
            select: {
              id: true,
              maxUses: true,
              usedCount: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!purchase) {
        return {
          redirect: {
            destination: '/learn',
            permanent: false,
          },
        }
      }

      const availableUpgrades = await prisma.upgradableProducts.findMany({
        where: {
          AND: [
            {
              upgradableFromId: purchase?.product?.id,
            },
            {
              NOT: {
                upgradableToId: {
                  in: allPurchases.map(({productId}) => productId),
                },
              },
            },
          ],
        },
        select: {
          upgradableTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          userId: token?.sub,
          productId: purchase?.product?.id,
          id: {
            not: purchaseId as string,
          },
          bulkCoupon: null,
        },
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return {
        props: {
          purchase: serialize(purchase),
          existingPurchase,
          availableUpgrades,
        },
      }
    }
  }
  return {
    props: {},
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

const TeamPage: React.FC<TeamPageProps> = ({
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
            <h1 className="flex items-center gap-2 text-xl font-dinosaur font-semibold">
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
