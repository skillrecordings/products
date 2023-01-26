import React from 'react'
import * as Yup from 'yup'
import {CategoryField, EmotionField, FeedbackField} from './fields'
import {useFeedback} from './feedback-context'
import {Formik, Form} from 'formik'
import {CheckIcon} from '@heroicons/react/solid'
import {XCircleIcon} from '@heroicons/react/outline'
import Spinner from './spinner'
import {FeedbackContext} from '@skillrecordings/skill-api'
import {useFeedbackWidget} from './use-feedback-widget'

export type FeedbackFormValues = {
  text: string
  context: FeedbackContext
  email?: string
}

const FeedbackValidationSchema = Yup.object().shape({
  text: Yup.string().required('Feedback field is required'),
})

export const FeedbackForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{location: string}>>
> = ({location}) => {
  const {initialValues, submitFeedbackForm, isSubmitted, error} =
    useFeedbackWidget({location})
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeedbackValidationSchema}
      onSubmit={submitFeedbackForm}
    >
      {({errors, touched, isSubmitting}) => (
        <Form data-sr-feeback-widget-form="">
          <FeedbackField
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
          />
          <div data-sr-feedback-widget-radio-group-container="">
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

export const ErrorMessage: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div
      aria-live="polite"
      className="flex items-center justify-center rounded-md bg-pink-300/10 px-5 py-3 font-medium leading-tight text-pink-300"
    >
      <XCircleIcon className="mr-2 h-6 w-6" aria-hidden="true" /> Error:{' '}
      {children}
    </div>
  )
}

export const ConfirmationMessage = ({
  message = `Feedback sent, thank you!`,
  isModal = true,
}: {
  message?: string
  isModal?: boolean
}) => {
  const {setIsFeedbackDialogOpen} = useFeedback()
  return (
    <div
      aria-live="polite"
      className="flex flex-wrap items-center justify-center rounded-md bg-teal-300/20 px-5 py-4 text-center text-sm font-semibold text-teal-300"
    >
      <CheckIcon className="mr-1 h-4 w-4" aria-hidden="true" />{' '}
      <span>{message}</span>
      {isModal && (
        <button
          className="inline-block pl-2 underline"
          onClick={() => {
            setIsFeedbackDialogOpen(false)
          }}
        >
          Close
        </button>
      )}
    </div>
  )
}

type SubmitButtonProps = {
  isSubmitting: boolean
}

export const SubmitButton: React.FC<
  React.PropsWithChildren<SubmitButtonProps>
> = ({isSubmitting, children}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      data-sr-feedback-widget-submit=""
    >
      {isSubmitting ? (
        <>
          <Spinner className="mr-1 w-4" aria-hidden="true" /> Sending...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default FeedbackForm
