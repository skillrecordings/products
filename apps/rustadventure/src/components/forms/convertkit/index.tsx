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
      email: '',
      first_name: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Enter Your Email'),
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
    'w-full rounded-md focus:ring-1 focus:ring-brand-orange-600 focus:outline-none border-gray-200 bg-white shadow-sm focus:border-transparent'

  return (
    <div id="subscribe">
      <div className="pb-4 font-bold sm:text-xl text-lg tracking-tight">
        {children}
      </div>
      <form className="space-y-4 w-full" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="first_name" className="text-sm font-semibold block">
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
          <label
            htmlFor="email_address"
            className="text-sm font-semibold block"
          >
            Email<span className="text-brand-orange-600">*</span>
          </label>
          <div>
            <input
              placeholder="you@company.com"
              id="email"
              type="email"
              name="email"
              className={inputClassName}
              required
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
        </div>
        <button
          type="submit"
          className="group focus:outline-none focus:ring-2 focus:ring-brand-orange-700 relative w-full px-5 py-3 font-semibold border border-orange-700 border-opacity-20 overflow-hidden bg-brand-orange-600 text-white rounded-md transition-all duration-300 ease-in-out"
        >
          <span className="relative z-10 drop-shadow-sm">
            Subscribe
            {/* Get the email course */}
            {/* Learn Rust */}
          </span>
          <div
            aria-hidden="true"
            className="absolute opacity-0 group-hover:opacity-30 bottom-0 left-0 w-full group-hover:h-full h-0 bg-brand-orange-700 transition-all duration-300 ease-in-out"
          />
        </button>
        <div className="text-xs opacity-50 pt-4 italic text-center">
          No spam, and you are free to unsubscribe at any time.
        </div>
      </form>
    </div>
  )
}

export default ConvertkitSubscribeForm
