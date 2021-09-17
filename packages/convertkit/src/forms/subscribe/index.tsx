import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {Input, Button} from '@skillrecordings/react/dist/components'

import queryString from 'query-string'

type SubscribeFormProps = {
  tag?: number
  form?: number
  sequence?: number
  actionLabel?: string
  onSuccessRedirectUrl?: string
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  children,
  tag,
  form,
  sequence,
  actionLabel = 'Submit',
  onSuccessRedirectUrl = '/confirm',
}) => {
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
        .post('/api/convertkit/subscribe', {...values, tag, sequence, form})
        .catch((err) => {
          formik.setStatus('error')
          console.log(err)
        })
        .then((res: any) => {
          if (onSuccessRedirectUrl) {
            const url = queryString.stringifyUrl({
              url: onSuccessRedirectUrl,
              query: {[CK_SUBSCRIBER_KEY]: res.data.id},
            })
            router.push(url)
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
      {formik.status === 'submitted' && (
        <div className="text-lg py-4">Thanks!</div>
      )}
      {!formik.status && (
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
        <div className="text-lg py-4">Something went wrong.</div>
      )}
    </>
  )
}

export default SubscribeForm
