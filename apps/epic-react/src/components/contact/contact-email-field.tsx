import * as React from 'react'
import cx from 'classnames'
import {FormikErrors, FormikTouched, useField} from 'formik'
import {FeedbackFormValues} from '@skillrecordings/feedback-widget/dist/form'
import isEmpty from 'lodash/isEmpty'
import {useSession} from 'next-auth/react'
import Spinner from '@skillrecordings/skill-lesson/spinner'

const ContactEmailField: React.FC<
  React.PropsWithChildren<{
    errors: FormikErrors<FeedbackFormValues>
    touched: FormikTouched<FeedbackFormValues>
  }>
> = ({errors, touched}) => {
  const {data: user, status: userLoadingStatus} = useSession()
  const [field] = useField({
    name: 'email',
  })

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <label
          className="inline-block flex-shrink-0 pb-1 font-semibold"
          htmlFor="text"
        >
          Your email address{' '}
          {userLoadingStatus === 'loading' ? (
            <Spinner aria-hidden="true" className="inline-block h-3 w-3" />
          ) : (
            !user?.user?.email && (
              <span className="font-normal text-gray-500">(required)</span>
            )
          )}
        </label>
        {errors.email && touched.email ? (
          <div
            aria-live="polite"
            className="inline-block pb-1 text-xs font-medium leading-tight text-pink-300 sm:text-sm"
          >
            {errors.email}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md ring-pink-600 ring-opacity-20 ring-offset-1':
            errors.email && touched.email,
        })}
      >
        <input
          id="email"
          name="email"
          type="email"
          required={true}
          value={field.value}
          onChange={(e) => {
            field.onChange(e)
          }}
          onBlur={(e) => {
            field.onBlur(e)
          }}
          placeholder="you@example.com"
          disabled={!isEmpty(user)}
          className={cx(
            `block w-full rounded-md border border-gray-200 bg-gray-100 p-3 shadow focus:ring-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/50`,
            {
              'bg-gray-100 bg-transparent text-gray-600 shadow-none dark:bg-transparent dark:text-gray-300':
                !isEmpty(user),
            },
          )}
        />
      </div>
    </div>
  )
}

export default ContactEmailField
