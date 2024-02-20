import React from 'react'
import * as Yup from 'yup'
import cx from 'classnames'
import {CategoryField, EmotionField, FeedbackField} from './fields'
import {useFeedback} from './feedback-context'
import {Formik, Form, FormikHelpers} from 'formik'
import {CheckIcon} from '@heroicons/react/solid'
import {XCircleIcon} from '@heroicons/react/outline'
import Spinner from '@/components/spinner'
import {FeedbackContext} from '@skillrecordings/skill-api'
import {useFeedbackForm} from './use-feedback-form'
import Link from 'next/link'

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
    useFeedbackForm({location})
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeedbackValidationSchema}
      onSubmit={submitFeedbackForm}
    >
      {({errors, touched, isSubmitting, values}) => {
        const isCodeQuestion = values.context.category === 'code'

        return (
          <Form className="flex flex-col space-y-5" placeholder="">
            <div
              className={cx({'pointer-events-none blur-sm': isCodeQuestion})}
            >
              {' '}
              <FeedbackField
                errors={errors}
                touched={touched}
                isSubmitted={isSubmitted}
              />
            </div>
            <div className="flex w-full flex-col space-y-5 md:flex-row md:space-x-10 md:space-y-0">
              <div
                className={cx({'pointer-events-none blur-sm': isCodeQuestion})}
              >
                <EmotionField name="context.emotion" id="context.emotion" />
              </div>
              <CategoryField name="context.category" id="context.category" />
            </div>
            {isCodeQuestion ? (
              <div className="pt-0.5 text-center">
                If you have any TypeScript/code related question or need help
                solving an exercise,{' '}
                <Link
                  className="font-medium text-cyan-300 hover:underline"
                  href="/discord"
                  target="_blank"
                >
                  ask on my Discord server ↗︎
                </Link>
              </div>
            ) : (
              <SubmitButton isSubmitting={isSubmitting}>
                Send feedback
              </SubmitButton>
            )}
            {isSubmitted && <ConfirmationMessage />}
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
      className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-base font-semibold text-black transition hover:shadow-lg hover:brightness-110 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2"
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
