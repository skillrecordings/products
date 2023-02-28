import * as React from 'react'
import * as Yup from 'yup'
import {
  ConfirmationMessage,
  ErrorMessage,
  FeedbackFormValues,
  SubmitButton,
} from '../../feedback-widget/form'
import {Form, Formik} from 'formik'
import {
  CategoryField,
  EmotionField,
  FeedbackField,
} from '../../feedback-widget/fields'
import ContactEmailField from './contact-email-field'
import {useFeedbackForm} from '../../feedback-widget/use-feedback-form'
import {useSession} from 'next-auth/react'

export const ContactValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),
  text: Yup.string().required('Feedback field is required'),
})

const ContactForm = () => {
  const {
    initialValues: initialFeedbackFormValues,
    submitFeedbackForm,
    isSubmitted,
    error,
  } = useFeedbackForm({
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
        <Form className="flex flex-col space-y-5">
          <ContactEmailField errors={errors} touched={touched} />
          <FeedbackField
            label="Your message"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
            showMarkdown={false}
          />
          <div className="flex w-full flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-10">
            <EmotionField name="context.emotion" id="context.emotion" />
            <CategoryField name="context.category" id="context.category" />
          </div>
          <SubmitButton isSubmitting={isSubmitting}>Send message</SubmitButton>
          {isSubmitted && (
            <ConfirmationMessage
              message="We've received your message. Thanks!"
              isModal={false}
            />
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      )}
    </Formik>
  )
}

export default ContactForm
