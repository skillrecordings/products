import * as React from 'react'
import cx from 'classnames'
import {FormikErrors, FormikTouched, useField} from 'formik'
import {FeedbackFormValues} from '../feedback/form'
import Spinner from 'components/spinner'
import isEmpty from 'lodash/isEmpty'
import {useUser} from '@skillrecordings/react'

const ContactEmailField: React.FC<
  React.PropsWithChildren<{
    errors: FormikErrors<FeedbackFormValues>
    touched: FormikTouched<FeedbackFormValues>
  }>
> = ({errors, touched}) => {
  const {user, userLoadingStatus} = useUser()
  const [field] = useField({
    name: 'email',
  })

  return (
    <div>
      <div className="flex items-center w-full justify-between">
        <label
          className="pb-1 inline-block text-sm font-semibold flex-shrink-0"
          htmlFor="text"
        >
          Your email address{' '}
          {userLoadingStatus === 'loading' ? (
            <Spinner aria-hidden="true" className="w-3 h-3 inline-block" />
          ) : (
            !user?.user?.email && (
              <span className="font-normal">(required)</span>
            )
          )}
        </label>
        {errors.email && touched.email ? (
          <div
            aria-live="polite"
            className="text-pink-600 sm:text-sm text-xs pb-1 inline-block font-semibold leading-tight"
          >
            {errors.email}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'ring-offset-1 rounded-md ring-opacity-20 ring ring-pink-600':
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
            `prose prose-sm overflow-y-auto shadow-sm bg-gray-100 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md `,
            {
              'text-gray-700 border-none bg-transparent shadow-none px-1':
                !isEmpty(user),
            },
          )}
        />
      </div>
    </div>
  )
}

export default ContactEmailField
