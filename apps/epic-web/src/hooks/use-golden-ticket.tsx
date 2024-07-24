import * as React from 'react'
import {useRouter} from 'next/router'
import {trpc} from 'trpc/trpc.client'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'

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
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()

  const {data: couponData} = trpc.coupons.getForCodeOrCoupon.useQuery({
    code: router.query.code ? (router.query.code as string) : undefined,
    coupon: router.query.coupon ? (router.query.coupon as string) : undefined,
  })

  const {data: product} = trpc.products.getProductById.useQuery({
    productId: couponData?.restrictedToProductId as string,
  })

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    couponData,
    {
      id: couponData?.restrictedToProductId as string,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: product?.name as string,
      description: product?.description,
      instructors: product?.instructors.map(
        (instructor: {name: string}) => instructor.name,
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
