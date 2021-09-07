import '@reach/dialog/styles.css'
import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Formik, Form, Field} from 'formik'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import * as yup from 'yup'
import {StateValue} from 'xstate'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type ClaimCouponOvervlayProps = {
  onPurchaseComplete: (object: {email: string}) => void
  error: string
  purchaseState: StateValue
}

type HandleSubmitProps = {
  email: string
}

function ClaimCouponOverlay({
  onPurchaseComplete,
  purchaseState,
  error,
}: ClaimCouponOvervlayProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)
  const handleSubmit = ({email}: HandleSubmitProps) => {
    onPurchaseComplete({email})
  }
  return (
    <DialogOverlay className="z-40" isOpen={isOpen}>
      <AnimatePresence>
        <motion.div
          className="px-5"
          initial={{opacity: 0, scale: 0.7, rotateX: 90}}
          animate={{opacity: 1, scale: 1, rotateX: 0}}
          exit={{opacity: 0, scale: 0.7, rotateX: -45}}
        >
          <DialogContent
            style={{width: '100%'}}
            aria-label="enter your email to claim your purchase"
            className="rounded-lg shadow-lg sm:max-w-screen-sm relative w-full z-50 dark:bg-gray-900 bg-white dark:text-white text-black"
          >
            {error ? (
              <>
                <div className="flex items-center justify-center -mt-20 relative">
                  <svg
                    className="text-white p-6 rounded-full bg-gray-800"
                    width="100px"
                    height="100px"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mt-8 leading-tight text-center">
                  {error}
                </h2>
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                    aria-label="Close"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center -mt-20 relative">
                  <svg
                    className="text-white p-6 rounded-full bg-gray-800"
                    width="100px"
                    height="100px"
                    version="1.1"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="m1.6133 18.711h96.773c0.64453 0 1.6133 0.64453 1.6133 1.6133v15.805c-7.418 0.32422-12.902 6.4531-12.902 13.871 0 7.0977 5.4844 13.227 12.902 13.871v15.484c0 0.96875-0.96875 1.9336-1.6133 1.9336h-96.773c-0.96875 0-1.6133-0.96875-1.6133-1.9336v-15.484c7.418-0.64453 12.902-6.7734 12.902-13.871 0-7.418-5.8047-13.547-12.902-13.871v-15.805c0-0.96875 0.64453-1.6133 1.6133-1.6133zm48.387 14.516 4.1953 12.902h13.227l-10.969 7.7422 4.1953 12.582-10.645-7.7422-10.969 7.7422 4.1953-12.582-10.645-7.7422h13.227l4.1953-12.902z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mt-8 leading-tight text-center">
                  {/* TODO replace with site title */}
                  Access My Product
                </h2>
                <p className="my-4 text-center text-base">
                  Enter your email address that will be used to log in to Pure
                  React and access the content. Please double check that it is
                  correct.
                </p>
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={loginSchema}
                  onSubmit={handleSubmit}
                >
                  <div>
                    <Form>
                      <div className="max-w-sm mx-auto my-8">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-5 "
                        >
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <Field
                            className="form-input bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:shadow-outline-gray-899 block w-full pl-10 sm:text-sm sm:leading-8 rounded-lg"
                            autoFocus
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:mb-8 mb-6 flex items-center justify-center mt-6">
                        <span className="inline-flex rounded-md shadow-sm">
                          {purchaseState === 'priceLoaded' && (
                            <button
                              type="submit"
                              className="inline-flex items-center px-5 py-3 border border-transparent text-base leading-8 font-semibold rounded-md text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 transition ease-in-out duration-150"
                            >
                              Get Access
                            </button>
                          )}
                          {purchaseState === 'handlePurchase' && (
                            <button
                              disabled
                              className="inline-flex items-center px-5 py-3 border border-transparent text-base leading-8 font-semibold rounded-md text-white o-80 cursor-wait bg-gray-300 focus:outline-none transition ease-in-out duration-150"
                            >
                              Claiming Coupon...
                            </button>
                          )}
                        </span>
                      </div>
                    </Form>

                    {purchaseState === 'priceLoaded' && (
                      <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                        <button
                          onClick={closeModal}
                          type="button"
                          className="text-gray-500 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition ease-in-out duration-150"
                          aria-label="Close"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </Formik>
              </>
            )}
          </DialogContent>
        </motion.div>
      </AnimatePresence>
    </DialogOverlay>
  )
}

export default ClaimCouponOverlay
