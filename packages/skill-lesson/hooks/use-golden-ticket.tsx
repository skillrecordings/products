import * as React from 'react'
import {useRouter} from 'next/router'
import {useCoupon} from '../path-to-purchase/use-coupon'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {CouponValidator} from '@skillrecordings/commerce-server'

export type GoldenTicketContextType = {
  redeemableCoupon?: boolean
  RedeemDialogForCoupon: () => React.JSX.Element | null
  validCoupon: boolean
  invalidReason: string | null
  couponData?: CouponValidator | null
}

const defaultGoldenTicketContext: GoldenTicketContextType = {
  redeemableCoupon: false,
  RedeemDialogForCoupon: () => null,
  validCoupon: false,
  invalidReason: 'No Coupon',
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

  console.log('couponData', couponData)

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

  console.log('validCoupon', validCoupon)

  let invalidReason = null

  switch (couponData?.error) {
    case 'coupon-not-found':
      invalidReason = 'No coupon found'
      break
    case 'coupon-not-valid-for-product':
      invalidReason = 'Coupon is not valid for this product'
      break
    case 'coupon-used-up':
      invalidReason =
        'Coupon is out of seats. Please contact us to purchase more seats.'
      break
    case 'coupon-expired':
      invalidReason = 'Coupon has expired'
      break
  }

  return (
    <GoldenTicketContext.Provider
      value={{
        redeemableCoupon,
        RedeemDialogForCoupon,
        validCoupon,
        invalidReason,
        couponData,
      }}
    >
      {children}
    </GoldenTicketContext.Provider>
  )
}

export function useGoldenTicket() {
  return React.useContext(GoldenTicketContext)
}
