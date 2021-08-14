import * as React from 'react'

const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM ?? ''

type ConvertkitSubscribeFormProps = {
  onSubmit?: () => void
}

const ConvertkitSubscribeForm: React.FC<ConvertkitSubscribeFormProps> = ({
  children,
  onSubmit,
}) => {
  const inputStyles =
    'w-full bg-gray-900 sm:text-xl text-lg px-5 py-4 rounded-lg text-white placeholder-gray-300 border-gray-700 shadow-inner focus:ring-0 focus:border-orange-300'
  const labelStyles = 'sm:text-lg text-base block pb-2'

  return (
    <div id="subscribe">
      <div>{children}</div>
      <form
        action={`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`}
        method="post"
        className="space-y-6 w-full max-w-md mx-auto"
        onSubmit={() => onSubmit && onSubmit()}
      >
        <div>
          <label htmlFor="fields[first_name]" className={labelStyles}>
            First Name
          </label>
          <input
            placeholder="Preferred name"
            id="fields[first_name]"
            name="fields[first_name]"
            type="text"
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="email_address" className={labelStyles}>
            Email<span className="text-orange-300">*</span>
          </label>

          <input
            placeholder="you@company.com"
            id="email_address"
            type="email"
            name="email_address"
            className={inputStyles}
            required
          />
        </div>

        <div className="w-full flex items-center justify-center py-8">
          <button
            type="submit"
            className="sm:px-20 px-16 py-5 text-xl font-semibold bg-gradient-to-t from-orange-500 via-orange-400 to-orange-300 text-white rounded-lg transform hover:shadow-xl hover:scale-105 focus:scale-95 transition-all ease-in-out duration-200 focus:outline-none outline-none focus:ring-2 focus:ring-orange-200"
          >
            Subscribe
          </button>
        </div>
        <div className="text-lg text-center text-gray-200">No spam, unsubscribe any time.</div>
      </form>
    </div>
  )
}

export default ConvertkitSubscribeForm
