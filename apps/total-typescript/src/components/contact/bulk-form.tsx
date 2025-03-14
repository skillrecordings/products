import * as React from 'react'
import * as Yup from 'yup'
import {
  ConfirmationMessage,
  ErrorMessage,
  FeedbackFormValues,
  SubmitButton,
} from '@/feedback-widget/form'
import {Form, Formik} from 'formik'
import {OptionalTextField, SeatSelectionField} from '@/feedback-widget/fields'
import ContactEmailField from './contact-email-field'
import {useFeedbackForm} from '@/feedback-widget/use-feedback-form'
import {useSession} from 'next-auth/react'

export const ContactValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),
  numberOfSeats: Yup.number().required('Number of seats is required'),
})

const BulkForm = () => {
  const {
    initialValues: initialFeedbackFormValues,
    submitFeedbackForm,
    isSubmitted,
    error,
  } = useFeedbackForm({
    location: 'bulk-form',
  })
  const {data: user} = useSession()
  const initialValues: FeedbackFormValues = {
    email: user?.user?.email || '',
    ...initialFeedbackFormValues,
    context: {
      ...initialFeedbackFormValues.context,
      emotion: ':moneybag:',
      category: 'quote requested',
    },
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ContactValidationSchema}
      onSubmit={submitFeedbackForm}
      enableReinitialize
    >
      {({errors, touched, isSubmitting}) => (
        <Form className="flex w-full flex-col space-y-5" placeholder="">
          <ContactEmailField errors={errors} touched={touched} />
          <SeatSelectionField />
          <OptionalTextField
            label="Additional Information"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
          />
          <SubmitButton isSubmitting={isSubmitting}>
            Request Quote!
          </SubmitButton>
          {isSubmitted && (
            <ConfirmationMessage
              message="We've received your message, we will follow up with you in the next couple of days. Thanks!"
              isModal={false}
            />
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      )}
    </Formik>
  )
}

export default BulkForm
