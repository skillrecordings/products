import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {Input, Button} from '@skillrecordings/react/dist/components'

type SubscribeAndTagPropsFormProps = {
  tagId?: number
  onSuccessRedirectUrl?: string
  actionLabel?: string
}

const ConvertkitSubscribeAndTagForm: React.FC<SubscribeAndTagPropsFormProps> =
  ({children, tagId, actionLabel = 'Submit', onSuccessRedirectUrl}) => {
    const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
    const router = useRouter()

    const formik = useFormik({
      initialValues: {
        email_address: '',
        first_name: '',
      },
      validationSchema: Yup.object().shape({
        email_address: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        first_name: Yup.string(),
      }),
      enableReinitialize: true,
      onSubmit: async (values) => {
        setSubmitting(true)
        axios
          .post(
            '/api/convertkit/subscribe',
            tagId ? {...values, tag: tagId} : {...values},
          )
          .catch((err) => {
            formik.setStatus('error')
            console.log(err)
          })
          .finally(() => {
            if (onSuccessRedirectUrl) {
              router.push(onSuccessRedirectUrl)
            } else {
              setSubmitting(false)
              formik.setStatus('submitted')
            }
          })
      },
      validateOnChange: false,
    })
    return (
      <>
        {children}
        {formik.status === 'submitted' ? (
          <div className="text-lg py-4">Thanks!</div>
        ) : (
          <form
            data-sr-convertkit-subscribe-form
            onSubmit={formik.handleSubmit}
            className="max-w-xs mx-auto space-y-4"
          >
            <Input
              name="first_name"
              label="First Name"
              onChange={formik.handleChange}
              placeholder="Your preferred name"
              type="text"
            />
            <Input
              name="email_address"
              label="Email"
              onChange={formik.handleChange}
              placeholder="Your email address"
              type="email"
              required
            />

            <Button isLoading={isSubmitting}>{actionLabel}</Button>
            <div className="flex flex-col items-center w-full justify-center">
              <div className="text-gray-200 opacity-60 pt-8 italic text-center">
                No spam, unsubscribe any time.
              </div>
            </div>
          </form>
        )}
        {formik.status === 'error' && (
          <div className="text-lg py-4">
            Something went wrong.{' '}
            <span aria-label="grinning face with sweat" role="img">
              😅
            </span>
          </div>
        )}
      </>
    )
  }

export default ConvertkitSubscribeAndTagForm
