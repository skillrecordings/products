import React, {FunctionComponent} from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import {useViewer} from '@skillrecordings/viewer'
import Layout from '../components/app/layout'
import Image from 'next/image'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type LoginFormProps = {
  className?: string
  children?: React.ReactElement
  button?: string
  label?: string
  formClassName?: string
  track?: any
}

const LoginForm: FunctionComponent<React.PropsWithChildren<LoginFormProps>> = ({
  className,
  children,
  button = 'Email a login link',
  label = 'Email address',
  formClassName = '',
  track,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const {requestSignInEmail} = useViewer()

  return (
    <Layout meta={{title: `Log in to My Product`}}>
      <div
        className={
          className
            ? className
            : 'w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center'
        }
      >
        <Image src="/placeholder-rect.svg" width={150} height={150} alt="" />
        <div className="mt-10 rounded-lg sm:mx-auto">
          {isSubmitted && (
            <h2 className="text-3xl font-bold leading-9 text-center">
              Email Sent
            </h2>
          )}
          {isError && (
            <h2 className="text-3xl font-bold leading-9 text-center">
              Something went wrong!
            </h2>
          )}
          {!isSubmitted &&
            !isError &&
            (children ? (
              children
            ) : (
              <>
                <h2 className="text-3xl font-bold leading-9 text-center">
                  Log in to My Product
                </h2>
                <p></p>
              </>
            ))}
          <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="pb-8">
              {!isSubmitted && !isError && (
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={loginSchema}
                  onSubmit={(values) => {
                    setIsSubmitted(true)
                    requestSignInEmail(values.email)
                      .then(() => {
                        track && track(values.email)
                      })
                      .catch(() => {
                        setIsSubmitted(false)
                        setIsError(true)
                      })
                  }}
                >
                  {(props) => {
                    const {
                      values,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    } = props
                    return (
                      <>
                        <form onSubmit={handleSubmit} className={formClassName}>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold leading-5"
                          >
                            {label}
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </div>
                            <input
                              id="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="you@company.com"
                              className="block w-full py-3 pl-10 text-gray-900 placeholder-gray-400 border-gray-300 rounded-md focus:ring-tomato-500 focus:border-tomato-500"
                              required
                            />
                          </div>

                          <div className="flex items-center justify-center w-full">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full px-5 py-3 mt-4 font-semibold text-white transition-all duration-150 ease-in-out rounded-md bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 hover:shadow-xl"
                            >
                              {button}
                            </button>
                          </div>
                        </form>
                      </>
                    )
                  }}
                </Formik>
              )}
              {isSubmitted && (
                <div className="space-y-4 leading-tight text-center">
                  <h3 className="text-xl font-semibold leading-tighter">
                    Please check your inbox for your sign in link.
                  </h3>
                  <p>
                    Sometimes this can land in SPAM! While we hope that isn't
                    the case if it doesn't arrive in a minute or three, please
                    check.
                  </p>
                </div>
              )}
              {isError && (
                <div className="text-text">
                  <p>
                    Login Link Not Sent{' '}
                    <span role="img" aria-label="sweating">
                      😅
                    </span>
                  </p>
                  <p className="pt-3">
                    Are you using an aggressive ad blocker such as Privacy
                    Badger? Please disable it for this site and reload the page
                    to try again.
                  </p>
                  <p className="pt-3">
                    If you <strong>aren't</strong> running aggressive adblocking
                    please check the console for errors and email
                    {process.env.NEXT_PUBLIC_SUPPORT_EMAIL} with any info and we
                    will help you ASAP.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LoginForm
