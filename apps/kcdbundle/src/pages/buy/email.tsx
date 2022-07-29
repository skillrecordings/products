import * as React from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import Layout from 'layouts'
import Image from 'next/image'
import Spinner from '@skillrecordings/react/dist/components/spinner'
import Button from '@skillrecordings/react/dist/components/button'
import axios from '@skillrecordings/axios'
import {createCheckoutSession} from '../../utils/sessions'
import {loadStripe} from '@stripe/stripe-js/pure'
import {isEmpty, find, get} from 'lodash'
import BundleImage from '../../../public/images/bundle@2x.png'

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

const BuyEmailForm: React.FC<React.PropsWithChildren<BuyEmailFormProps>> = ({
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

    const stripe_customer_id = get(
      find(purchases, (purchase) => purchase.stripe_customer_id),
      'stripe_customer_id',
    )

    const availableToUpgrade = sellables.filter((sellable) => {
      return !find(purchases, (purchase: any) => {
        return purchase.site === sellable.site
      })
    })

    if (isEmpty(availableToUpgrade)) {
      throw new Error('no upgrade available')
    }

    return createCheckoutSession(
      availableToUpgrade,
      email,
      stripe_customer_id,
    ).then(async (data) => {
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
    <Layout meta={{title: `Confirm your email address`}} noFooter>
      <div
        className={
          className
            ? className
            : 'w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center px-5'
        }
      >
        <Image
          src={BundleImage}
          placeholder="blur"
          alt=""
          width={1020 / 4}
          height={694 / 4}
        />
        <div className="sm:mx-auto rounded-lg mt-10">
          {isSubmitted && (
            <h2 className="text-center text-3xl leading-9 font-bold">
              Checking Previous Purchases
            </h2>
          )}
          {isError && (
            <h2 className="text-center text-3xl leading-9 font-bold">
              Records show that you've already bought everything in this bundle!
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
                <p className="text-center">
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
                    requestsPurchases(values.email).catch((e: any) => {
                      console.error(e)
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
                            <Button
                              type="submit"
                              isDisabled={isSubmitting}
                              isLoading={isSubmitting}
                              className="mt-4 w-full flex items-center justify-center text-center bg-gradient-to-t from-blue-600 to-blue-500 rounded-md text-white px-5 py-4 font-medium shadow-md hover:scale-105 transition-all ease-in-out duration-200 hover:shadow-lg border border-blue-700 border-opacity-20"
                            >
                              {button}
                            </Button>
                          </div>
                        </form>
                      </>
                    )
                  }}
                </Formik>
              )}
              {isSubmitted && (
                <div className="text-center leading-tight space-y-4">
                  <Spinner className="w-8 h-8 mx-auto origin-center" />
                  <h3 className="text-xl leading-tighter font-semibold">
                    We are loading Stripe Checkout to complete your purchase.
                  </h3>
                  <p>Hold tight, you're almost there!</p>
                </div>
              )}
              {isError && (
                <div className="text-center">
                  <p className="text-lg">
                    There are no upgrades available{' '}
                    <span role="img" aria-label="sweating">
                      😅
                    </span>
                  </p>

                  <p className="pt-3">
                    It looks like you've already purchased all the products in
                    this bundle! If that seems like an error please email{' '}
                    <a
                      className="text-indigo-500 underline"
                      href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                    >
                      {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                    </a>{' '}
                    with any info and we will help you ASAP.
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
