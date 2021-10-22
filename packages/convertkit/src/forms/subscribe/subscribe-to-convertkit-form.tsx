import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import {useFormik} from 'formik'
import {Input, Button} from '@skillrecordings/react/dist/components'
import {
  CONVERTKIT_SUBSCRIBE_API_URL,
  CONVERTKIT_SIGNUP_FORM,
  CK_SUBSCRIBER_KEY,
} from '@skillrecordings/config'
import queryString from 'query-string'

type ConvertkitSubscriber = {
  id: string
  email: string
  first_name: string
}

type SubscribeFormProps = {
  actionLabel?: string
  successMessage?: string | React.ReactElement
  errorMessage?: string | React.ReactElement
  submitButtonElem?: React.ReactElement
  onError?: (error?: any) => void
  onSuccess?: (subscriber?: ConvertkitSubscriber) => void
  formId?: number
  subscribeApiURL?: string
  id?: string
  [rest: string]: any
}

export const redirectUrlBuilder = (
  subscriber: ConvertkitSubscriber,
  path: string,
) => {
  const url = queryString.stringifyUrl({
    url: path,
    query: {
      [CK_SUBSCRIBER_KEY]: subscriber.id,
      email: subscriber.email,
    },
  })
  return url
}

/**
 * This form posts to a designated api URL (assumes /api/convertkit/subscribe
 * by default)
 * @param formId the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`
 * @param submitButtonElem an element to use as the button for the form submit
 * @param errorMessage A string or element representing the message shown on error
 * @param successMessage A string or element representing the message shown on success
 * @param actionLabel Label for the button (not used if submitButtonElem is used)
 * @param onError function to call on error
 * @param onSuccess function to call on success
 * @param subscribeApiURL optional param to override the api url that gets posted to
 * @param rest anything else!
 * @constructor
 */
export const SubscribeToConvertkitForm: React.FC<SubscribeFormProps> = ({
  formId = CONVERTKIT_SIGNUP_FORM,
  submitButtonElem,
  errorMessage = <p>Something went wrong.</p>,
  successMessage = <p>Thanks!</p>,
  actionLabel = 'Subscribe',
  onError = () => {},
  onSuccess = () => {},
  subscribeApiURL = CONVERTKIT_SUBSCRIBE_API_URL,
  id,
  ...rest
}) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)

  const handleOnSubmit = async (values: {
    email: string
    first_name: string
  }) => {
    const {email, first_name} = values
    setSubmitting(true)
    axios
      .post(subscribeApiURL, {email, first_name, form: formId})
      .then((response: any) => {
        const subscriber: ConvertkitSubscriber = response.data
        onSuccess(subscriber)
        formik.setStatus('success')
      })
      .catch((error) => {
        onError(error)
        formik.setStatus('error')
        console.log(error)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const formik = useFormik({
    initialStatus: '',
    initialValues: {
      email: '',
      first_name: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Required'),
      first_name: Yup.string(),
    }),
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
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
            id={`first_name_${id}`}
            onChange={formik.handleChange}
            placeholder="Preferred name"
            type="text"
          />
          <Input
            label="Email"
            name="email"
            id={`email_${id}`}
            onChange={formik.handleChange}
            placeholder="you@company.com"
            type="email"
            required
          />
          {submitButtonElem ? (
            React.cloneElement(submitButtonElem, {
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

export default SubscribeToConvertkitForm
