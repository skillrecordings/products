import * as React from 'react'

const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM

type ConvertkitSubscribeFormProps = {
  onSubmit?: () => void
  button?: React.ReactElement
  classNames?: {
    input?: string
    label?: string
    button?: string
    comment?: string
    children?: string
    form?: string
    asterisk?: string
    buttonContainer?: string
  }
}

const ConvertkitSubscribeForm: React.FC<ConvertkitSubscribeFormProps> = ({
  children,
  onSubmit,
  button,
  classNames = {
    input:
      'w-full rounded-sm dark:bg-gray-900 dark:text-white dark:placeholder-gray-300',
    label: 'text-sm font-semibold block',
    button:
      'w-full px-3 py-2 font-semibold dark:bg-white dark:text-black bg-black text-white rounded-sm',
    comment: 'text-xs italic text-center',
    form: 'space-y-4 w-full',
    children: 'pb-4 font-bold sm:text-xl text-lg tracking-tight',
    asterisk: 'opacity-50',
    buttonContainer: '',
  },
}) => {
  return (
    <div id="subscribe" className="w-full">
      {children && <div className={classNames.children}>{children}</div>}
      <form
        action={`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`}
        method="post"
        className={classNames.form}
        onSubmit={() => onSubmit && onSubmit()}
      >
        <div>
          <label htmlFor="fields[first_name]" className={classNames.label}>
            First Name
          </label>
          <input
            placeholder="Preferred name"
            id="fields[first_name]"
            name="fields[first_name]"
            type="text"
            className={classNames.input}
          />
        </div>
        <div>
          <label htmlFor="email_address" className={classNames.label}>
            Email<span className={classNames.asterisk}>*</span>
          </label>
          <input
            placeholder="you@company.com"
            id="email_address"
            type="email"
            name="email_address"
            className={classNames.input}
            required
          />
        </div>
        {button || (
          <div className={classNames.buttonContainer}>
            <button type="submit" className={classNames.button}>
              Subscribe
            </button>
          </div>
        )}
        <div className={classNames.comment}>No spam, unsubscribe any time.</div>
      </form>
    </div>
  )
}

export default ConvertkitSubscribeForm
