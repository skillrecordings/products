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
   * Message to display after succesfully submitting the form.
   * @type string | React.ReactElement
   */
  successMessage?: string | React.ReactElement
  /**
   * Message to display if there was an error submitting the form.
   * @type string | React.ReactElement
   */
  errorMessage?: string | React.ReactElement
  button?: React.ReactElement
} & SubscribeFormOnSuccessOptions

type SubscribeFormOnSuccessOptions =
  | {
      /**
       * Function called when the form has been succesfully submitted.
       * By default, it will redirect to `onSuccessRedirectUrl` with `email_address` passed as URL param.
       * You can pass `false` to skip it entirely.
       * @type () => void | false
       */
      onSuccess:
        | ((
            res: {data: {id: string}; [key: string]: any},
            values: {email_address: string; first_name: string},
          ) => void)
        | false
      onSuccessRedirectUrl?: never
    }
  | {
      onSuccess?: never
      /**
       * The URL to redirect to after succesfully submitting a form. Default is `/confirm`.
       * Submitted `email_address` will be automatically passed as URL param.
       * @type string
       */
      onSuccessRedirectUrl?: string
    }

type SubscribeFormProps =
  | ({
      /**
       * The tag id to tag a subscriber with.
       * @type number
       */
      tag: number
      form?: never
      sequence?: never
    } & SubscribeFormOptions)
  | ({
      tag?: never
      /**
       * The form id to subscribe to. Default is `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`.
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
  button,
  sequence,
  errorMessage = <p>Something went wrong.</p>,
  successMessage = <p>Thanks!</p>,
  actionLabel = 'Subscribe',
  onSuccessRedirectUrl = '/confirm',
  onSuccess = (res, values) => {
    const url = queryString.stringifyUrl({
      url: onSuccessRedirectUrl,
      query: {
        [CK_SUBSCRIBER_KEY]: res.data.id,
        email_address: values.email_address,
      },
    })
    return router.push(url)
  },
  ...rest
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
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true)
      axios
        .post('/api/convertkit/subscribe', {...values, tag, form, sequence})
        .catch((error) => {
          formik.setStatus('error')
          console.log(error)
        })
        .then((res: any) => {
          if (onSuccess) {
            onSuccess(res, values)
          }
        })
        .finally(() => {
          setSubmitting(false)
          formik.setStatus('success')
        })
    },
  })

  return (
    <form
      data-sr-convertkit-subscribe-form={formik.status}
      onSubmit={formik.handleSubmit}
      {...rest}
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
          {button ? (
            React.cloneElement(button, {
              isLoading: isSubmitting,
              type: 'submit',
            })
          ) : (
            <Button isLoading={isSubmitting} type="submit">
              {actionLabel}
            </Button>
          )}
        </>
      )}
      {formik.status === 'success' &&
        (React.isValidElement(successMessage) ? (
          successMessage
        ) : (
          <p>{successMessage}</p>
        ))}
      {formik.status === 'error' &&
        (React.isValidElement(errorMessage) ? (
          errorMessage
        ) : (
          <p>{errorMessage}</p>
        ))}
    </form>
  )
}

export default SubscribeForm
