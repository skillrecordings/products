import * as React from 'react'
import {useRouter} from 'next/router'
import {useCoupon} from '../path-to-purchase/use-coupon'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'

export type GoldenTicketContextType = {
  redeemableCoupon?: boolean
  RedeemDialogForCoupon: () => React.JSX.Element | null
  validCoupon: boolean
}

const defaultGoldenTicketContext: GoldenTicketContextType = {
  redeemableCoupon: false,
  RedeemDialogForCoupon: () => null,
  validCoupon: false,
}

export const GoldenTicketContext = React.createContext(
  defaultGoldenTicketContext,
)

export const GoldenTicketProvider = ({
  couponImageUrl,
  children,
}: {
  couponImageUrl?: string
  children: React.ReactNode
}) => {
  const router = useRouter()

  const {data: couponData} =
    trpcSkillLessons.coupons.getForCodeOrCoupon.useQuery({
      code: router.query.code ? (router.query.code as string) : undefined,
      coupon: router.query.coupon ? (router.query.coupon as string) : undefined,
    })

  console.log({couponData})

  const {data: product} = trpcSkillLessons.products.getProductById.useQuery({
    productId: couponData?.restrictedToProductId as string,
  })

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    couponData,
    {
      id: couponData?.restrictedToProductId as string,
      ...(couponImageUrl && {
        image: {
          url: couponImageUrl,
          width: 132,
          height: 112,
        },
      }),
      title: product?.name as string,
      description: product?.description,
      instructors: product?.instructors.map(
        (instructor: {name: string}) => instructor?.name,
      ),
    },
  )

  return (
    <GoldenTicketContext.Provider
      value={{redeemableCoupon, RedeemDialogForCoupon, validCoupon}}
    >
      {children}
    </GoldenTicketContext.Provider>
  )
}

export function useGoldenTicket() {
  return React.useContext(GoldenTicketContext)
}
