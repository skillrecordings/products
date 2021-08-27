import * as React from 'react'
import Button from 'components/button'

const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM

type ConvertkitSubscribeFormProps = {
  onSubmit?: () => void
}

const ConvertkitSubscribeForm: React.FC<ConvertkitSubscribeFormProps> = ({
  onSubmit,
}) => {
  const inputClassName: string =
    'autofill:caret-black autofill:text-fill-black autofill:bg-white w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-brand-pink-500 focus:outline-none focus:border-transparent'
  const labelClassName: string = 'block pb-1'
  return (
    <form
      action={`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`}
      method="post"
      className="space-y-4 w-full"
      onSubmit={() => onSubmit && onSubmit()}
    >
      <div>
        <label htmlFor="fields[first_name]" className={labelClassName}>
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
        <label htmlFor="email_address" className={labelClassName}>
          Email<span className="opacity-50">*</span>
        </label>
        <div>
          <input
            placeholder="@"
            id="email_address"
            type="email"
            name="email_address"
            className={inputClassName}
            required
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center pt-4">
        <Button type="submit">Sign Up</Button>
      </div>
      <div className="text-sm text-gray-500 text-center pt-6">
        No spam, unsubscribe any time.
      </div>
    </form>
  )
}

export default ConvertkitSubscribeForm
