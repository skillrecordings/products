import * as React from 'react'
import {
  ConfirmationMessage,
  ErrorMessage,
  FeedbackValidationSchema,
  SubmitButton,
} from '../feedback/form'
import {Form, Formik} from 'formik'
import {CategoryField, EmotionField, FeedbackField} from '../feedback/fields'
import ConteactEmailField from './contact-email-field'
import {useFeedbackForm} from '../../hooks/use-feedback-form'

const ContactForm = () => {
  const {initialValues, submitFeedbackForm, isSubmitted, error} =
    useFeedbackForm({location: 'contact'})

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeedbackValidationSchema}
      onSubmit={submitFeedbackForm}
    >
      {({errors, touched, isSubmitting}) => (
        <Form className="flex flex-col space-y-5">
          <ConteactEmailField errors={errors} touched={touched} />
          <FeedbackField
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
            showMarkdown={false}
          />
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 md:space-x-10 w-full">
            <EmotionField name="context.emotion" id="context.emotion" />
            <CategoryField name="context.category" id="context.category" />
          </div>
          <SubmitButton isSubmitting={isSubmitting}>Send feedback</SubmitButton>
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
