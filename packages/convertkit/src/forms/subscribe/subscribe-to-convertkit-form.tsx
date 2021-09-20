import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import {useFormik} from 'formik'
import {Input, Button} from '@skillrecordings/react/dist/components'

const SUBSCRIBE_API_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_API_URL || '/api/convertkit/subscribe'

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
  formId: number
  subscribeApiURL?: string
}

/**
 * This form posts to a designated api URL (assumes /api/convertkit/subscribe
 * by default)
 * @param formId the Convertkit form id
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
const SubscribeToConvertkitForm: React.FC<SubscribeFormProps> = ({
  formId,
  submitButtonElem,
  errorMessage = <p>Something went wrong.</p>,
  successMessage = <p>Thanks!</p>,
  actionLabel = 'Subscribe',
  onError = () => {},
  onSuccess = () => {},
  subscribeApiURL = SUBSCRIBE_API_URL,
  ...rest
}) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)

  const handleOnSubmit = async (values: {
    email_address: string
    first_name: string
  }) => {
    const {email_address, first_name} = values
    setSubmitting(true)
    axios
      .post(subscribeApiURL, {email_address, first_name, form: formId})
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
