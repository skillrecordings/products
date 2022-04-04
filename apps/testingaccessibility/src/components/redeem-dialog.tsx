import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useRouter} from 'next/router'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

interface RedeemDialogProps {
  open: boolean
  couponId: boolean
}

const RedeemDialog = ({open = false, couponId}: RedeemDialogProps) => {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async ({email}) => {
      const purchase = await fetch(`/api/redeem`, {
        method: 'post',
        body: JSON.stringify({
          email,
          couponId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json())

      router.push(`/thanks/redeem?purchaseId=${purchase?.id}`)
    },
  })
  return (
    <AlertDialogPrimitive.Root open={open}>
      <Content>
        <AlertDialogPrimitive.Title className="text-lg font-medium">
          Do you want to redeem this coupon?
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="text-md text-gray-700">
          Enter the email address you wish to be associated with your license.
        </AlertDialogPrimitive.Description>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-end mt-2">
            <label htmlFor="email">email address:</label>
            <input
              id="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
          <div className="flex justify-end mt-2">
            <AlertDialogPrimitive.Cancel asChild>
              <button className="mr-6 flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Cancel
              </button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <button
                className="flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                type="submit"
              >
                Yes, invite user
              </button>
            </AlertDialogPrimitive.Action>
          </div>
        </form>
      </Content>
    </AlertDialogPrimitive.Root>
  )
}

export default RedeemDialog

const Content: React.FC = ({children, ...props}) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed bg-black bg-opacity-30 inset-0 z-40" />
      <AlertDialogPrimitive.Content
        className="animate-fade-in-out shadow-lg z-50 bg-white w-[90vw] rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg max-h-[85vh] p-6"
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}
