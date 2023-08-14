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
  onSuccess?: (subscriber?: ConvertkitSubscriber, email?: string) => void
  formId?: number
  subscribeApiURL?: string
  id?: string
  fields?: Record<string, string>
  [rest: string]: any
}

/**
 * @deprecated use @skillrecordings/ui/forms/convertkit-subscribe-form instead
 *
 * This form posts to a designated api URL (assumes `/api/convertkit/subscribe
 * by default`)
 *
 * Styling is handled by css! In the following example we utilize Tailwind and `@apply`
 *
 * @example
 * ```css
 * [data-sr-convertkit-subscribe-form] {
 *     @apply flex flex-col w-full max-w-[340px] mx-auto;
 *     [data-sr-input] {
 *         @apply block mb-4 w-full px-4 py-3 border placeholder-opacity-60 bg-opacity-50 rounded-lg shadow sm:text-base sm:leading-6;
 *     }
 *     [data-sr-input-label] {
 *         @apply font-medium pb-1 inline-block;
 *     }
 *     [data-sr-input-asterisk] {
 *         @apply opacity-50;
 *     }
 *     [data-sr-button] {
 *         @apply pt-4 pb-5 mt-4 flex items-center justify-center rounded-lg text-black bg-yellow-500 hover:bg-opacity-100 transition font-bold text-lg focus-visible:ring-yellow-200 hover:scale-105 hover:-rotate-1 hover:bg-yellow-400;
 *     }
 * }
 *```
 * @param formId the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`
 * @param submitButtonElem an element to use as the button for the form submit
 * @param errorMessage A string or element representing the message shown on error
 * @param successMessage A string or element representing the message shown on success
 * @param actionLabel Label for the button (not used if submitButtonElem is used)
 * @param onError function to call on error
 * @param onSuccess function to call on success
 * @param subscribeApiURL optional param to override the api url that gets posted to
 * @param fields custom subscriber fields to create or update
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
  fields,
  ...rest
}) => {
  const {isSubmitting, status, handleChange, handleSubmit} = useConvertkitForm({
    formId,
    onSuccess,
    onError,
    fields,
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
