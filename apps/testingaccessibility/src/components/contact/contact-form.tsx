import * as React from 'react'
import * as Yup from 'yup'
import {
  ConfirmationMessage,
  ErrorMessage,
  FeedbackFormValues,
  SubmitButton,
} from '../feedback/form'
import {Form, Formik} from 'formik'
import {CategoryField, EmotionField, FeedbackField} from '../feedback/fields'
import ContactEmailField from './contact-email-field'
import {useFeedbackForm} from '../../hooks/use-feedback-form'
import {useUser} from 'hooks/use-user'
import {useRouter} from 'next/router'

export const ContactValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),
  text: Yup.string().required('Feedback field is required'),
})

const ContactForm = () => {
  const {submitFeedbackForm, isSubmitted, error} = useFeedbackForm({
    location: 'contact',
  })
  const {user, userLoadingStatus} = useUser()
  const router = useRouter()
  const initialValues: FeedbackFormValues = {
    email: user?.user?.email || '',
    text: '',
    context: {
      category: 'general',
      emotion: ':wave:',
      url: `${process.env.NEXT_PUBLIC_URL}${router.pathname}`,
      location: 'contact',
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
        <Form className="flex flex-col space-y-5">
          <ContactEmailField
            user={user}
            userLoadingStatus={userLoadingStatus}
            errors={errors}
            touched={touched}
          />
          <FeedbackField
            label="Your message"
            errors={errors}
            touched={touched}
            isSubmitted={isSubmitted}
            showMarkdown={false}
          />
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 md:space-x-10 w-full">
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
