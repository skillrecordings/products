import * as React from 'react'
import cx from 'classnames'
import {FormikErrors, FormikTouched} from 'formik'
import {FeedbackFormValues} from '../feedback/form'

const ConteactEmailField: React.FC<{
  errors: FormikErrors<FeedbackFormValues>
  touched: FormikTouched<FeedbackFormValues>
}> = ({errors, touched}) => {
  return (
    <div>
      <div className="flex items-center w-full justify-between">
        <label
          className="pb-1 inline-block text-sm font-semibold flex-shrink-0"
          htmlFor="text"
        >
          Your email address <span className="font-normal">(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="text-pink-600 sm:text-sm text-xs pb-1 inline-block font-semibold leading-tight"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'ring-offset-1 rounded-md ring-opacity-20 ring ring-pink-600':
            errors.text && touched.text,
        })}
      >
        <input
          id="email"
          type="email"
          required={true}
          placeholder="you@example.com"
          className="prose prose-sm overflow-y-auto shadow-sm bg-gray-100 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
        />
      </div>
    </div>
  )
}

export default ConteactEmailField
