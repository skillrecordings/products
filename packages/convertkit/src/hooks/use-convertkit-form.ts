import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {ConvertkitSubscriber} from '../types'
import {
  CONVERTKIT_SIGNUP_FORM,
  CONVERTKIT_SUBSCRIBE_API_URL,
} from '@skillrecordings/config'

export function useConvertkitForm({
  submitUrl = CONVERTKIT_SUBSCRIBE_API_URL,
  formId = (CONVERTKIT_SIGNUP_FORM || 0) as number,
  onSuccess,
  onError,
}: {
  submitUrl?: string
  formId?: number
  onSuccess: (subscriber: ConvertkitSubscriber) => void
  onError: (error?: any) => void
}) {
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
        .post(submitUrl, {email, first_name, form: formId})
        .then((response: any) => {
          const subscriber: ConvertkitSubscriber = response.data
          onSuccess(subscriber)
          setStatus('success')
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
