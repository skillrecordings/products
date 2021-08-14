import * as React from 'react'

const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM

type ConvertkitSubscribeFormProps = {
  onSubmit?: () => void
}

const ConvertkitSubscribeForm: React.FC<ConvertkitSubscribeFormProps> = ({
  onSubmit,
}) => {
  const inputClassName =
    'autofill:text-fill-black autofill:caret-black dark:bg-black w-full text-lg py-2 px-4 leading-7 border-gray-200 rounded-md focus:ring-violet-400 focus:ring-2 focus:outline-none focus:border-transparent placeholder-gray-400'

  return (
    <div id="subscribe">
      <form
        action={`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`}
        method="post"
        onSubmit={() => onSubmit && onSubmit()}
        className="max-w-sm mx-auto flex flex-col items-center py-8"
      >
        <div className="space-y-5 w-full">
          <div>
            <label
              htmlFor="fields[first_name]"
              className="block text-base pb-1"
            >
              First Name
            </label>
            <input
              placeholder="Preferred name"
              id="fields[first_name]"
              name="fields[first_name]"
              type="text"
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="email_address" className="block text-base pb-1">
              Email<span className="dark:text-fuchsia-400">*</span>
            </label>
            <div>
              <input
                placeholder="you@company.com"
                id="email_address"
                type="email"
                name="email_address"
                className={inputClassName}
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="font-medium text-lg rounded-full focus:bg-gray-500 focus:ring-2 focus:scale-90 focus:ring-black hover:scale-105 transition-all hover:shadow-xl focus:outline-none mt-8 sm:px-16 px-14 py-4 bg-gradient-to-r dark:from-pink-500 dark:to-purple-500 from-violet-500 to-pink-500 text-white ease-in-out"
        >
          <span className="drop-shadow-md">Subscribe</span>
        </button>
      </form>
      <div className="text-center pt-8 text-base opacity-70">
        No spam, and you are free to unsubscribe at any time.
      </div>
    </div>
  )
}

export default ConvertkitSubscribeForm
