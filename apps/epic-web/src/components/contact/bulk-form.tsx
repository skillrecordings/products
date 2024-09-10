import * as React from 'react'
import * as Yup from 'yup'
import {
  ConfirmationMessage,
  ErrorMessage,
  FeedbackFormValues,
  SubmitButton,
} from '@skillrecordings/feedback-widget/dist/form'
import {Form, Formik} from 'formik'
import {
  OptionalTextField,
  SeatSelectionField,
  EmotionField,
  CategoryField,
} from '@skillrecordings/feedback-widget/dist/fields'
import ContactEmailField from './contact-email-field'
import {useFeedbackWidget} from '@skillrecordings/feedback-widget/dist/use-feedback-widget'
import {useSession} from 'next-auth/react'

export const ContactValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),
  seats: Yup.number().required('Number of seats is required'),
})

const BulkForm = () => {
  const {
    initialValues: initialFeedbackFormValues,
    submitFeedbackForm,
    isSubmitted,
    error,
  } = useFeedbackWidget({
    location: 'contact',
  })
  const {data: user} = useSession()
  const initialValues: FeedbackFormValues = {
    email: user?.user?.email || '',
    ...initialFeedbackFormValues,
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
          <SeatSelectionField
            label="Number of Seats"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
          />
          <OptionalTextField
            label="Additional Information"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
          />
          <EmotionField
            name="context.emotion"
            id="context.emotion"
            isHidden={true}
            customEmoji=":moneybag:"
          />
          <CategoryField
            name="context.category"
            id="context.category"
            isHidden={true}
            customCategory="quote requested"
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
