import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {type Subscriber} from '../schemas/subscriber'
import {
  CONVERTKIT_SIGNUP_FORM,
  CONVERTKIT_SUBSCRIBE_API_URL,
} from '@skillrecordings/config'

export function useConvertkitForm({
  submitUrl = CONVERTKIT_SUBSCRIBE_API_URL,
  formId = CONVERTKIT_SIGNUP_FORM || '0',
  fields,
  onSuccess,
  onError,
  validationSchema,
  validateOnChange = false,
  formLoadedAt,
}: {
  submitUrl?: string
  formId?: string
  onSuccess: (subscriber: Subscriber, email?: string) => void
  onError: (error?: any) => void
  fields?: any
  validationSchema?: Yup.ObjectSchema<any>
  validateOnChange?: boolean
  formLoadedAt?: number
}): {
  isSubmitting: boolean
  status: string
  handleChange: any
  handleSubmit: any
  errors: any
  touched: any
} {
  const {isSubmitting, status, handleChange, handleSubmit, errors, touched} =
    useFormik({
      initialStatus: '',
      initialValues: {
        email: '',
        first_name: '',
        website: '',
      },
      validationSchema:
        validationSchema ||
        Yup.object().shape({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          first_name: Yup.string(),
        }),
      validateOnChange: validateOnChange,
      enableReinitialize: true,
      onSubmit: async ({email, first_name, website}, {setStatus}) => {
        // Honeypot: if the hidden field is filled, silently "succeed" (don't tell bots they failed)
        if (website) {
          setStatus('success')
          return
        }
        // Timing: reject submissions faster than 1.5s (bots fill forms instantly)
        const elapsed = formLoadedAt ? Date.now() - formLoadedAt : Infinity
        if (elapsed < 1500) {
          setStatus('success')
          return
        }
        return axios
          .post(submitUrl, {email, first_name, form: formId, fields})
          .then((response: any) => {
            const subscriber: Subscriber = response.data
            onSuccess(subscriber, email)
            setStatus('success')
            if (!subscriber) {
              setStatus('error')
            }
          })
          .catch((error: Error) => {
            onError(error)
            setStatus('error')
            console.log(error)
          })
      },
    })

  return {isSubmitting, status, handleChange, handleSubmit, errors, touched}
}
