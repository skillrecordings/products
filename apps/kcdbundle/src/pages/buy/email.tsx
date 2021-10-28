import * as React from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import Layout from '@skillrecordings/react/dist/layouts'
import Image from 'next/image'
import axios from '@skillrecordings/axios'
import {createCheckoutSession} from '../../utils/sessions'
import {loadStripe} from '@stripe/stripe-js/pure'
import {isEmpty} from 'lodash'

const emailFormSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type BuyEmailFormProps = {
  className?: string
  children?: React.ReactElement
  button?: string
  label?: string
  formClassName?: string
  track?: any
}

const epicReactSellable: any = {
  site: 'epic_react',
  sellable_id: 'epic-react-pro-e28f',
  sellable: 'playlist',
  bulk: false,
  quantity: 1,
}
const testingJavaScriptSellable: any = {
  site: 'pro_testing',
  sellable_id: 'pro-testing',
  sellable: 'playlist',
  bulk: false,
  quantity: 1,
}

export const sellables = [epicReactSellable, testingJavaScriptSellable]

const BuyEmailForm: React.FC<BuyEmailFormProps> = ({
  className,
  children,
  button = 'Complete Your Purchase',
  label = 'Email address',
  formClassName = '',
  track,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  async function requestsPurchases(email: string) {
    const purchases = await axios
      .post('/api/users', {email})
      .then(({data}) => data)

    const availableToUpgrade = sellables.filter((sellable) => {
      return !purchases.includes(sellable.sellable_id)
    })

    if (isEmpty(availableToUpgrade)) {
      throw new Error('no upgrade available')
    }

    return createCheckoutSession(availableToUpgrade).then(async (data) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_TOKEN)
        throw new Error('no stripe token')

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_TOKEN)
      if (stripe) {
        stripe.redirectToCheckout({
          sessionId: data.id,
        })
      }
    })
  }

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
        <div className="sm:mx-auto rounded-lg mt-10">
          {isSubmitted && (
            <h2 className="text-center text-3xl leading-9 font-bold">
              Checking Previous Purchases
            </h2>
          )}
          {isError && (
            <h2 className="text-center text-3xl leading-9 font-bold">
              You've already bought this bundle!
            </h2>
          )}
          {!isSubmitted &&
            !isError &&
            (children ? (
              children
            ) : (
              <>
                <h2 className="text-center text-3xl leading-9 font-bold">
                  First we need your correct email address!
                </h2>
                <p>
                  If you've bought anything from KCD in the past, please use the
                  same email.
                </p>
              </>
            ))}
          <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="pb-8">
              {!isSubmitted && !isError && (
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={emailFormSchema}
                  onSubmit={(values) => {
                    setIsSubmitted(true)
                    requestsPurchases(values.email).catch(() => {
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
                            className="block leading-5 text-sm font-semibold"
                          >
                            {label}
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
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
                              className="py-3 text-gray-900 placeholder-gray-400 focus:ring-tomato-500 focus:border-tomato-500 block w-full pl-10 border-gray-300 rounded-md"
                              required
                            />
                          </div>

                          <div className="flex justify-center items-center w-full">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full mt-4 transition-all duration-150 ease-in-out bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900  text-white hover:shadow-xl font-semibold py-3 px-5 rounded-md"
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
                <div className="text-center leading-tight space-y-4">
                  <h3 className="text-xl leading-tighter font-semibold">
                    We are loading Stripe Checkout to complete your purchase.
                  </h3>
                  <p>Hold tight, you're almost there!</p>
                </div>
              )}
              {isError && (
                <div className="text-text">
                  <p>
                    There are no upgrades available{' '}
                    <span role="img" aria-label="sweating">
                      😅
                    </span>
                  </p>

                  <p className="pt-3">
                    It looks like you've already purchased all the products in
                    this bundle! If that seems like an error please email
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

export default BuyEmailForm
