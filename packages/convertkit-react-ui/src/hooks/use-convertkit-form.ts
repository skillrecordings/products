import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {ConvertkitSubscriber} from '../types'
import {
  CONVERTKIT_SIGNUP_FORM,
  CONVERTKIT_SUBSCRIBE_API_URL,
} from '@skillrecordings/config'

/**
 * @deprecated use @skillrecordings/skill-lesson/hooks/use-convertkit-form instead
 **/
export function useConvertkitForm({
  submitUrl = CONVERTKIT_SUBSCRIBE_API_URL,
  formId = CONVERTKIT_SIGNUP_FORM || '0',
  fields,
  onSuccess,
  onError,
}: {
  submitUrl?: string
  formId?: string
  onSuccess: (subscriber: ConvertkitSubscriber, email?: string) => void
  onError: (error?: any) => void
  fields?: any
}): {
  isSubmitting: boolean
  status: string
  handleChange: any
  handleSubmit: any
} {
  const {isSubmitting, status, handleChange, handleSubmit} = useFormik({
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
    onSubmit: async ({email, first_name}, {setStatus}) => {
      return axios
        .post(submitUrl, {email, first_name, form: formId, fields})
        .then((response: any) => {
          const subscriber: ConvertkitSubscriber = response.data
          onSuccess(subscriber, email)
          setStatus('success')
          if (!subscriber) {
            setStatus('error')
          }
        })
        .catch((error) => {
          onError(error)
          setStatus('error')
          console.log(error)
        })
    },
  })

  return {isSubmitting, status, handleChange, handleSubmit}
}
