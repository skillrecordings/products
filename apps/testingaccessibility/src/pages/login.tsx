import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'

const Login: React.FC<{csrfToken: string}> = ({csrfToken}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  return (
    <Layout
      footer={null}
      meta={{title: 'Log in to Testing Accessibility'}}
      className="bg-green-700 bg-noise"
    >
      <div className="flex-grow w-full mx-auto md:pb-40 pb-16 md:pt-16 pt-0 flex flex-col items-center justify-center p-5 text-white">
        <main className="sm:mx-auto rounded-lg">
          <div className="max-w-sm mx-auto flex items-center justify-center w-full">
            <Image
              placeholder="blur"
              src={require('../../public/assets/lighthouse@2x.png')}
              alt="a wooden sign with Testing Accessibility text on it"
              quality={100}
              width={1024 / 4}
              height={1024 / 4}
              priority
            />
          </div>
          <h1 className="text-center text-3xl leading-9 font-bold pt-4 font-aglet-slab">
            Log in to Testing Accessibility
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
                      className="h-5 w-5 text-white/50"
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
                    required={true}
                    placeholder="you@example.com"
                    className="mb-3 focus:ring-green-500 focus:border-green-500 py-3 text-white placeholder-white/50 block w-full pl-10 border border-white border-opacity-20 bg-green-800/50 rounded-md"
                    {...register('email', {required: true})}
                  />
                </div>

                <button className="w-full flex items-center justify-center mt-5 px-5 pb-4 pt-3 border border-transparent text-lg font-semibold rounded-md text-black bg-yellow-500 hover:bg-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-200 font-dinosaur">
                  Email me a login link
                </button>
              </form>
            </div>
          </div>
        </main>
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
