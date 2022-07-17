import React from 'react'
import * as Yup from 'yup'
import {CategoryField, EmotionField, FeedbackField} from './fields'
import {useFeedback} from 'context/feedback-context'
import {Formik, Form, FormikHelpers} from 'formik'
import {CheckIcon} from '@heroicons/react/solid'
import {XCircleIcon} from '@heroicons/react/outline'
import Spinner from 'components/spinner'
import {sendFeedback} from '@skillrecordings/skill-api/dist/client'
import {FeedbackContext} from '@skillrecordings/skill-api'

type FeedbackFormValues = {
  text: string
  context: FeedbackContext
}

const FeedbackValidationSchema = Yup.object().shape({
  text: Yup.string().required('Feedback field is required'),
})

const FeedbackForm: React.FC = () => {
  const {location} = useFeedback()
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>()
  const initialValues: FeedbackFormValues = {
    text: '',
    context: {
      category: 'general',
      emotion: ':neutral_face:',
      url: window.location.href,
      location,
    },
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeedbackValidationSchema}
      onSubmit={async (
        values: FeedbackFormValues,
        {setSubmitting, resetForm}: FormikHelpers<FeedbackFormValues>,
      ) => {
        setSubmitting(true)
        console.log('submitting feedback', values)
        await sendFeedback(values.text, values.context).then((error) => {
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
      }}
    >
      {({errors, touched, isSubmitting}) => (
        <Form className="flex flex-col space-y-5">
          <FeedbackField
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
          />
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 md:space-x-10 w-full">
            <EmotionField name="context.emotion" id="context.emotion" />
            <CategoryField name="context.category" id="context.category" />
          </div>
          <SubmitButton isSubmitting={isSubmitting}>Send feedback</SubmitButton>
          {isSubmitted && <ConfirmationMessage />}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      )}
    </Formik>
  )
}

const ErrorMessage: React.FC = ({children}) => {
  return (
    <div
      aria-live="polite"
      className="px-5 py-3 text-sm font-semibold flex items-center justify-center bg-pink-50 text-pink-700 rounded-md leading-tight"
    >
      <XCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" /> Error:{' '}
      {children}
    </div>
  )
}

const ConfirmationMessage = () => {
  const {setIsFeedbackDialogOpen} = useFeedback()
  return (
    <div
      aria-live="polite"
      className="px-5 py-3 text-sm font-semibold flex flex-wrap items-center justify-center text-center bg-teal-50 text-teal-700 rounded-md"
    >
      <CheckIcon className="w-4 h-4 mr-1" aria-hidden="true" />{' '}
      <span>Feedback sent, thank you!</span>
      <button
        className="underline pl-2 inline-block"
        onClick={() => {
          setIsFeedbackDialogOpen(false)
        }}
      >
        Close
      </button>
    </div>
  )
}

type SubmitButtonProps = {
  isSubmitting: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  children,
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition hover:shadow-lg"
    >
      {isSubmitting ? (
        <>
          <Spinner className="w-4 mr-1" aria-hidden="true" /> Sending...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default FeedbackForm
