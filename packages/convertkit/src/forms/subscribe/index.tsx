import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import queryString from 'query-string'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {Input, Button} from '@skillrecordings/react/dist/components'

type SubscribeFormOptions = {
  /**
   * The content of submit button.
   * @type string
   */
  actionLabel?: string
  /**
   * The URL to redirect to after succesfully submitting a form. Default is `/confirm`.
   * Submitted `email_address` will be automatically passed as URL param.
   * Providing `false` value will skip the redirect entirely.
   * @type string | false
   */
  onSuccessRedirectUrl?: string | false
}

type SubscribeFormProps =
  | ({
      /**
       * Tag ID to tag a subscriber. It will also subscribe them.
       * @type number
       */
      tag: number
      form?: never
      sequence?: never
    } & SubscribeFormOptions)
  | ({
      tag?: never
      /**
       * Form ID to subscribe to. Default is `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`.
       * @type number
       */
      form: number
      sequence?: never
    } & SubscribeFormOptions)
  | ({
      tag?: never
      form?: never
      /**
       * Sequence ID to subscribe to.
       * @type number
       */
      sequence: number
    } & SubscribeFormOptions)
  | ({tag?: never; form?: never; sequence?: never} & SubscribeFormOptions)

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  tag,
  form,
  sequence,
  actionLabel = 'Subscribe',
  onSuccessRedirectUrl = '/confirm',
}) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
  const router = useRouter()

  const formik = useFormik({
    initialStatus: '',
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
        .post('/api/convertkit/subscribe', {...values, tag, form, sequence})
        .catch((err) => {
          formik.setStatus('error')
          console.log(err)
        })
        .then((res: any) => {
          if (onSuccessRedirectUrl) {
            const url = queryString.stringifyUrl({
              url: onSuccessRedirectUrl,
              query: {
                [CK_SUBSCRIBER_KEY]: res.data.id,
                email_address: values.email_address,
              },
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
    <form
      data-sr-convertkit-subscribe-form={formik.status}
      onSubmit={formik.handleSubmit}
    >
      {!formik.status && (
        <>
          <Input
            label="First Name"
            name="first_name"
            onChange={formik.handleChange}
            placeholder="Preferred name"
            type="text"
          />
          <Input
            label="Email"
            name="email_address"
            onChange={formik.handleChange}
            placeholder="you@company.com"
            type="email"
            required
          />
          <Button isLoading={isSubmitting}>{actionLabel}</Button>
        </>
      )}
      {formik.status === 'submitted' && <p>Thanks!</p>}
      {formik.status === 'error' && <p>Something went wrong.</p>}
    </form>
  )
}

export default SubscribeForm
