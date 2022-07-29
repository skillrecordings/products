import * as React from 'react'
import {Input, Button} from '@skillrecordings/react/dist/components'
import {ConvertkitSubscriber} from '../../types'
import {useConvertkitForm} from '../../hooks/use-convertkit-form'

export type SubscribeFormProps = {
  actionLabel?: string
  successMessage?: string | React.ReactElement
  errorMessage?: string | React.ReactElement
  submitButtonElem?: React.ReactElement
  onError?: (error?: any) => void
  onSuccess?: (subscriber?: ConvertkitSubscriber) => void
  formId?: number
  subscribeApiURL?: string
  id?: string
  [rest: string]: any
}

/**
 * This form posts to a designated api URL (assumes /api/convertkit/subscribe
 * by default)
 *
 * TODO: using forward refs would allow us to export the component parts of the
 * which might make styling and compose-ability more obvious/robust
 *
 * @param formId the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`
 * @param submitButtonElem an element to use as the button for the form submit
 * @param errorMessage A string or element representing the message shown on error
 * @param successMessage A string or element representing the message shown on success
 * @param actionLabel Label for the button (not used if submitButtonElem is used)
 * @param onError function to call on error
 * @param onSuccess function to call on success
 * @param subscribeApiURL optional param to override the api url that gets posted to
 * @param rest anything else!
 * @constructor
 */
export const SubscribeToConvertkitForm: React.FC<
  React.PropsWithChildren<SubscribeFormProps>
> = ({
  formId,
  submitButtonElem,
  errorMessage = <p>Something went wrong.</p>,
  successMessage = <p>Thanks!</p>,
  actionLabel = 'Subscribe',
  onError = () => {},
  onSuccess = () => {},
  subscribeApiURL,
  id,
  ...rest
}) => {
  const {isSubmitting, status, handleChange, handleSubmit} = useConvertkitForm({
    formId,
    onSuccess,
    onError,
    submitUrl: subscribeApiURL,
  })

  return (
    <form
      data-sr-convertkit-subscribe-form={status}
      onSubmit={handleSubmit}
      {...rest}
    >
      <Input
        label="First Name"
        name="first_name"
        id={id ? `first_name_${id}` : 'first_name'}
        onChange={handleChange}
        placeholder="Preferred name"
        type="text"
      />
      <Input
        label="Email"
        name="email"
        id={id ? `email_${id}` : 'email'}
        onChange={handleChange}
        placeholder="you@example.com"
        type="email"
        required
      />
      {submitButtonElem ? (
        React.cloneElement(submitButtonElem, {
          isLoading: isSubmitting,
          type: 'submit',
        })
      ) : (
        <Button isLoading={isSubmitting} type="submit">
          {actionLabel}
        </Button>
      )}
      {status === 'success' &&
        (React.isValidElement(successMessage) ? (
          successMessage
        ) : (
          <p>{successMessage}</p>
        ))}
      {status === 'error' &&
        (React.isValidElement(errorMessage) ? (
          errorMessage
        ) : (
          <p>{errorMessage}</p>
        ))}
    </form>
  )
}

export default SubscribeToConvertkitForm
