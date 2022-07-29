import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'

const Login: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{csrfToken: string}>>
> = ({csrfToken}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  return (
    <Layout
      meta={{title: 'Login to Engineering Management'}}
      className="flex flex-col h-full sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-56px)]"
    >
      <div
        className="flex-grow w-full mx-auto md:pb-40 pb-16 py-16 flex flex-col items-center justify-center p-5"
        style={{
          backgroundImage: "url('/assets/pattern-topography.svg')",
        }}
      >
        <div className="sm:mx-auto rounded-lg">
          <h1 className="text-center text-3xl leading-9 font-bold pt-4">
            Log in to Engineering Management
          </h1>

          <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-md">
            <div>
              <form className="" method="post" action="/api/auth/signin/email">
                <label
                  htmlFor="email"
                  className="block leading-5 text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
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
                    placeholder="you@example.com"
                    className="mb-3 focus:ring-blue-500 focus:border-blue-500  py-3 text-gray-900 placeholder-gray-400 block w-full pl-10 border-2 border-gray-200 rounded-md"
                    {...register('email', {required: true})}
                  />
                </div>

                <button className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Email me a login link
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
