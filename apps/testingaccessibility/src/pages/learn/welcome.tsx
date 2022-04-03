import * as React from 'react'
import {GetServerSideProps} from 'next'
import prisma from '../../db'
import Link from 'next/link'
import {serialize} from '../../utils/prisma-next-serializer'
import {useRouter} from 'next/router'
import {getSession, useSession} from 'next-auth/react'
import {getDecodedToken} from '../../utils/get-decoded-token'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId} = query
  const token = await getDecodedToken(req)

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
  return {
    props: {},
  }
}

const Welcome: React.FC<{
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  token: any
  availableUpgrades: {upgradableTo: {id: string; name: string}}[]
}> = ({purchase, token, existingPurchase, availableUpgrades}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount
  const [canRedeem, setCanRedeem] = React.useState(
    Boolean(redemptionsLeft && !existingPurchase),
  )

  async function handleSelfRedeem() {
    const redeemedPurchase = await fetch(`/api/redeem`, {
      method: 'post',
      body: JSON.stringify({
        email: session?.user?.email,
        couponId: purchase?.bulkCoupon?.id,
        sendEmail: false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    if (redeemedPurchase && !redeemedPurchase.error) {
      setCanRedeem(false)
      setPersonalPurchase(redeemedPurchase)
    }
  }
  return (
    <div className="prose">
      <h1>
        You did it!{' '}
        {purchase.bulkCoupon
          ? `${purchase.product?.name} for your team!`
          : `${purchase.product?.name} is yours!`}
      </h1>

      <p>
        Invoice:{' '}
        <Link href={`/invoices/${purchase.merchantChargeId}`}>
          {purchase.merchantChargeId}
        </Link>
      </p>
      {redemptionsLeft ? (
        <div>
          <p>
            send to colleagues:{' '}
            {`${process.env.NEXT_PUBLIC_URL}?code=${purchase?.bulkCoupon?.id}`}
          </p>
          {canRedeem ? (
            <button
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleSelfRedeem}
            >
              Redeem one for yourself
            </button>
          ) : null}
          {personalPurchase ? (
            <p>access this content yourself: {existingPurchase.id}</p>
          ) : null}
        </div>
      ) : null}
      {availableUpgrades ? (
        <div>available upgrades: {JSON.stringify(availableUpgrades)}</div>
      ) : null}
      <p>raw purchase: {JSON.stringify(purchase)}</p>
    </div>
  )
}

export default Welcome
