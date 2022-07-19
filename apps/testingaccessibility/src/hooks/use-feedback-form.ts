import {useRouter} from 'next/router'
import React from 'react'
import {FormikHelpers} from 'formik'
import {sendFeedback} from '@skillrecordings/skill-api/dist/client'
import {FeedbackFormValues} from '../components/feedback/form'

export const useFeedbackForm = ({location}: {location: string}) => {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>()

  const submitFeedbackForm = React.useCallback(
    async (
      values: FeedbackFormValues,
      {setSubmitting, resetForm}: FormikHelpers<FeedbackFormValues>,
    ) => {
      setSubmitting(true)
      await sendFeedback(values).then((error) => {
        if (error.error) {
          console.error({error})
          setSubmitting(false)
          setIsSubmitted(false)
          setError(error.message)
        } else {
          setSubmitting(false)
          setIsSubmitted(true)
          resetForm()
        }
      })
    },
    [],
  )

  const initialValues: FeedbackFormValues = {
    text: '',
    context: {
      category: 'general',
      emotion: ':wave:',
      url: `${process.env.NEXT_PUBLIC_URL}${router.pathname}`,
      location,
    },
  }

  return {
    initialValues,
    submitFeedbackForm,
    isSubmitted,
    error,
  }
}
