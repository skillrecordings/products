import * as React from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

type ConvertkitSubscribeFormProps = {
  onSubmit?: (subscriber?: any) => void
}

const ConvertkitSubscribeForm: React.FC<ConvertkitSubscribeFormProps> = ({
  children,
  onSubmit,
}) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      email_address: '',
      first_name: '',
    },
    validationSchema: Yup.object({
      email_address: Yup.string().required('Enter Your Email'),
      first_name: Yup.string(),
    }),

    onSubmit: async (values) => {
      // await new Promise((r) => setTimeout(r, 500))
      setSubmitting(true)
      axios.post('/api/convertkit/subscribe', values).then(({data}) => {
        setSubmitting(false)
        if (onSubmit) {
          onSubmit(data)
        }
      })
    },
  })
  const inputClassName =
    'autofill:text-fill-black autofill:caret-black dark:bg-black w-full text-lg py-2 px-4 leading-7 border-gray-200 rounded-md focus:ring-violet-400 focus:ring-2 focus:outline-none focus:border-transparent placeholder-gray-400'

  return (
    <div id="subscribe" className="w-full">
      <div className="w-full">{children}</div>
      <form
        className="max-w-sm w-full mx-auto py-8 space-y-5"
        onSubmit={formik.handleSubmit}
      >
        <div>
          <label htmlFor="first_name" className="block text-base pb-1">
            First Name
          </label>
          <input
            placeholder="Preferred name"
            id="first_name"
            name="first_name"
            type="text"
            className={inputClassName}
            onChange={formik.handleChange}
            value={formik.values.first_name}
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
              onChange={formik.handleChange}
              value={formik.values.email_address}
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            className="font-medium text-lg rounded-full focus:bg-gray-500 focus:ring-2 focus:scale-90 focus:ring-black hover:scale-105 transition-all hover:shadow-xl focus:outline-none mt-4 sm:px-16 px-14 py-4 bg-gradient-to-r dark:from-pink-500 dark:to-purple-500 from-violet-500 to-pink-500 text-white ease-in-out"
          >
            <span className="relative z-10 drop-shadow-sm">Subscribe</span>
            <div
              aria-hidden="true"
              className="absolute opacity-0 group-hover:opacity-30 bottom-0 left-0 w-full group-hover:h-full h-0 bg-brand-orange-700 transition-all duration-300 ease-in-out"
            />
          </button>
        </div>
        <div className="text-xs opacity-50 pt-4 italic text-center">
          No spam, and you are free to unsubscribe at any time.
        </div>
      </form>
    </div>
  )
}

export default ConvertkitSubscribeForm
