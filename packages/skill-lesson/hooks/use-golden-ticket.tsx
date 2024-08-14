import * as React from 'react'
import {useRouter} from 'next/router'
import {useCoupon} from '../path-to-purchase/use-coupon'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {Decimal} from '@skillrecordings/database'
import * as _skillrecordings_database from '@skillrecordings/database'

export type GoldenTicketContextType = {
  redeemableCoupon?: boolean
  RedeemDialogForCoupon: () => React.JSX.Element | null
  validCoupon: boolean
  invalidReason: string
  couponData?:
    | {
        isValid: boolean
        isRedeemable: boolean
        error: string
        isExpired?: undefined
        isUsedUp?: undefined
        id: string
        code: string | null
        createdAt: Date
        expires: Date | null
        maxUses: number
        default: boolean
        merchantCouponId: string | null
        status: number
        usedCount: number
        percentageDiscount: Decimal
        restrictedToProductId: string | null
        bulkPurchaseId: string | null
      }
    | {
        isExpired: boolean
        isUsedUp: boolean
        isRedeemable: boolean
        isValid: boolean
        error?: undefined
        id: string
        code: string | null
        createdAt: Date
        expires: Date | null
        maxUses: number
        default: boolean
        merchantCouponId: string | null
        status: number
        usedCount: number
        percentageDiscount: Decimal
        restrictedToProductId: string | null
        bulkPurchaseId: string | null
      }
    | null
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

  let invalidReason = couponData ? 'Coupon is Valid' : 'No Coupon'

  switch (true) {
    case couponData && couponData.isUsedUp:
      invalidReason =
        'Coupon is out of seats. Please contact us to purchase more seats.'
      break
    case couponData && couponData.isExpired:
      invalidReason = 'Coupon has expired.'
      break
    case couponData && !couponData.isValid:
      invalidReason = 'Coupon is not valid.'
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
