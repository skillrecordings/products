import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useRouter} from 'next/router'
import {redeemFullPriceCoupon} from './redeem-full-price-coupon'
import {useSession} from 'next-auth/react'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

interface RedeemDialogProps {
  open: boolean
  couponId: string
}

const RedeemDialog = ({open = false, couponId}: RedeemDialogProps) => {
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
  return (
    <AlertDialogPrimitive.Root open={open}>
      <Content>
        <AlertDialogPrimitive.Title className="px-8 pt-8 font-heading text-3xl font-black ">
          <div className="pb-2 text-sm uppercase text-brand-red">
            You've been invited
          </div>
          Do you want to redeem this coupon?
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="px-8 pt-4 pb-8 leading-relaxed text-gray-800">
          Enter the email address you wish to be associated with your license.
          We recommend using an email address you will have access to for years
          to come. Please triple check the address!
        </AlertDialogPrimitive.Description>
        <form onSubmit={formik.handleSubmit} className="px-8">
          <div className="flex flex-col">
            <label htmlFor="email" className="pb-1">
              Email address
            </label>
            <input
              required
              className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus-visible:border-transparent focus-visible:ring-sky-500"
              id="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex w-full justify-end gap-3 py-8">
            <AlertDialogPrimitive.Cancel asChild>
              <button
                onClick={(e) => {
                  const code = router.query.code
                  const pathname = router.asPath.replace(`?code=${code}`, '')
                  router.push(pathname)
                }}
                className="flex rounded-full bg-gray-200 py-2 px-4 text-sm font-medium text-gray-600 focus-visible:ring-sky-500 hover:bg-gray-300"
              >
                Cancel
              </button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <button
                className="transitions flex rounded-full border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm ring-offset-1 focus:outline-none focus-visible:ring-sky-500 hover:brightness-105"
                type="submit"
              >
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
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm" />
      <AlertDialogPrimitive.Content
        className="animate-fade-in-out fixed top-1/2 left-1/2 z-50 w-full max-w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-50 shadow-2xl sm:max-w-md"
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}
