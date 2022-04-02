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
    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId as string,
      },
      select: {
        merchantChargeId: true,
        bulkCoupon: {
          select: {
            id: true,
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
      },
    }
  }
  return {
    props: {},
  }
}

const Learn: React.FC<{
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string} | null
    product: {id: string; name: string | null} | null
  }
  existingPurchase: {
    id: string
    product: {id: string; name: string | null} | null
  }
  token: any
}> = ({purchase, token, existingPurchase}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )
  const [canRedeem, setCanRedeem] = React.useState(
    Boolean(purchase.bulkCoupon && !existingPurchase),
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
      {purchase.bulkCoupon ? (
        <div>
          <p>
            send to colleagues:{' '}
            {`${process.env.NEXT_PUBLIC_URL}?code=${purchase.bulkCoupon.id}`}
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
      <p>raw purchase: {JSON.stringify(purchase)}</p>
    </div>
  )
}

export default Learn
