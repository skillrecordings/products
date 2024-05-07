import React from 'react'
import * as Yup from 'yup'
import {EmotionField, FeedbackField} from './fields'
import {Formik, Form} from 'formik'
import {XCircleIcon} from '@heroicons/react/outline'
import Spinner from '@/components/spinner'
import {FeedbackContext} from '@skillrecordings/skill-api'
import {useFeedbackForm} from './use-feedback-form'
import cx from 'classnames'

export type FeedbackFormValues = {
  text: string
  context: FeedbackContext
  email?: string
}

const FeedbackValidationSchema = Yup.object().shape({
  text: Yup.string().required('Feedback field is required'),
})

export const FeedbackForm: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<{
      setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>
      location: string
    }>
  >
> = ({setFormSubmitted, location}) => {
  const {initialValues, submitFeedbackForm, isSubmitted, error} =
    useFeedbackForm({location})

  React.useEffect(() => {
    if (isSubmitted) setFormSubmitted(true)
  }, [isSubmitted])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeedbackValidationSchema}
      onSubmit={submitFeedbackForm}
    >
      {({errors, touched, isSubmitting, values}) => {
        return (
          <Form className="flex flex-col space-y-5" placeholder="">
            <EmotionField name="context.emotion" id="context.emotion" />
            <FeedbackField
              errors={errors}
              touched={touched}
              isSubmitted={isSubmitted}
              showMarkdown={false}
            />
            <SubmitButton isSubmitting={isSubmitting}>Send</SubmitButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
        )
      }}
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
      className={cx(
        'flex h-10 w-20 items-center justify-center self-end rounded-md bg-blue-500 px-4 text-lg font-semibold leading-none text-white duration-200 hover:bg-blue-600',
        {
          'cursor-not-allowed opacity-60': isSubmitting,
        },
      )}
    >
      {isSubmitting ? (
        <>
          <Spinner className="w-4" aria-hidden="true" />
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default FeedbackForm
