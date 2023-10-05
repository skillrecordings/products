import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import {useFormik} from 'formik'
import Balancer from 'react-wrap-balancer'
import * as Yup from 'yup'
import {useRouter} from 'next/router'
import {redeemFullPriceCoupon} from './redeem-full-price-coupon'
import {useSession} from 'next-auth/react'
import Image from 'next/image'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

interface RedeemDialogProps {
  open: boolean
  couponId: string
  product?: {
    image?: {
      url: string
      width: number
      height: number
    }
    title: string
    description?: string
  }
}

const RedeemDialog = ({open = false, couponId, product}: RedeemDialogProps) => {
  const {data: session} = useSession()
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: session?.user?.email || '',
    },
    validationSchema,
    onSubmit: async ({email}) => {
      const {purchase, redeemingForCurrentUser} = await redeemFullPriceCoupon({
        email,
        couponId,
      })

      if (purchase.error) {
        console.error(purchase.message)
      } else {
        if (redeemingForCurrentUser) {
          await fetch('/api/auth/session?update')
          router.push(`/welcome?purchaseId=${purchase?.id}`)
        } else {
          router.push(`/thanks/redeem?purchaseId=${purchase?.id}`)
        }
      }
    },
  })
  const {title, image, description} = product || {}
  return (
    <AlertDialogPrimitive.Root data-redeem-dialog="" open={open}>
      <Content>
        {image && title && (
          <div className="flex px-5 text-center flex-col items-center justify-center w-full pt-8 pb-5 border-b dark:border-gray-700 border-gray-200">
            {image && (
              <Image
                src={image.url}
                alt=""
                aria-hidden
                width={image.width}
                height={image.height}
              />
            )}
            {title ? (
              <div className="text-lg pt-5 font-medium">
                <Balancer>
                  Coupon for {title} by{' '}
                  {process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME}{' '}
                  {process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}
                </Balancer>
              </div>
            ) : null}
          </div>
        )}
        <AlertDialogPrimitive.Title data-title="">
          Do you want to redeem this coupon?
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description data-description="">
          Enter the email address you wish to be associated with your license.
          We recommend using an email address you will have access to for years
          to come. Please triple check the address!
        </AlertDialogPrimitive.Description>
        <form onSubmit={formik.handleSubmit}>
          <div data-email="">
            <label htmlFor="email">Email address</label>
            <input
              required
              id="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="you@example.com"
            />
          </div>
          <div data-actions="">
            <AlertDialogPrimitive.Cancel asChild>
              <button
                onClick={(e) => {
                  const code = router.query.code
                  const pathname = router.asPath.replace(`?code=${code}`, '')
                  router.push(pathname)
                }}
                data-cancel=""
              >
                Cancel
              </button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <button data-submit="" type="submit">
                Yes, Claim License
              </button>
            </AlertDialogPrimitive.Action>
          </div>
        </form>
      </Content>
    </AlertDialogPrimitive.Root>
  )
}

export default RedeemDialog

const Content: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
  ...props
}) => {
  return (
    <>
      <AlertDialogPrimitive.Overlay data-redeem-dialog-overlay="" />
      <AlertDialogPrimitive.Content data-redeem-dialog-content="" {...props}>
        {children}
      </AlertDialogPrimitive.Content>
    </>
  )
}
