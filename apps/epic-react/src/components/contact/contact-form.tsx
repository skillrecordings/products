import * as React from 'react'
import * as Yup from 'yup'

import {Form, Formik} from 'formik'

import ContactEmailField from './contact-email-field'

import {useSession} from 'next-auth/react'
import type {FeedbackFormValues} from '../feedback-widget/form'
import {useFeedbackForm} from '@/feedback-widget/use-feedback-form'
import {
  CategoryField,
  EmotionField,
  FeedbackField,
} from '@/feedback-widget/fields'
import {
  ConfirmationMessage,
  ErrorMessage,
  SubmitButton,
} from '@/feedback-widget/form'

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
      {({errors, touched, isSubmitting, values}) => (
        <Form className="flex w-full flex-col space-y-5" placeholder="">
          <ContactEmailField errors={errors} touched={touched} />
          <FeedbackField
            label="Your message"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
            showMarkdown={false}
          />
          <div className="flex w-full flex-col space-y-5 md:flex-row md:space-x-10 md:space-y-0">
            <EmotionField name="context.emotion" id="context.emotion" />
            <CategoryField
              categories={['general', 'help']}
              name="context.category"
              id="context.category"
            />
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
