import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'

const Login: React.FC<React.PropsWithChildren<{csrfToken: string}>> = ({
  csrfToken,
}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  const router = useRouter()

  const {query} = router

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '⛔️',
      })
    }
  }, [router])

  return (
    <Layout footer={null} meta={{title: 'Log in to Total TypeScript'}}>
      <div className="mx-auto flex w-full flex-grow flex-col items-center justify-center p-5 pb-16 pt-0 text-white md:pb-40 md:pt-16">
        <main className="rounded-lg sm:mx-auto">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center">
            <Image
              placeholder="blur"
              src={require('../../public/assets/gem.png')}
              alt=""
              quality={100}
              width={100}
              height={100}
              priority
              aria-hidden="true"
            />
          </div>
          <h1 className="pt-4 text-center font-heading text-3xl font-bold leading-9">
            Log in to Total TypeScript
          </h1>
          {query?.error === 'Verification' ? (
            <p className="mt-4 max-w-sm sm:mx-auto sm:mt-8 sm:w-full">
              That sign in link is no longer valid. It may have been used
              already or it may have expired. Please request a new log in link
              below.{' '}
              <a
                className="inline-flex items-center space-x-1 text-gray-100 hover:underline"
                href="mailto:team@testingaccessibility.com"
              >
                Click here to email us
              </a>{' '}
              if you need help.
            </p>
          ) : null}
          <div className="mt-4 sm:mx-auto sm:mt-8 sm:w-full sm:max-w-md">
            <div>
              <form className="" method="post" action="/api/auth/signin/email">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-5"
                >
                  Email address
                </label>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    className="mb-3 block w-full rounded-md border border-white border-opacity-20 bg-gray-800/50 py-3 pl-10 text-white placeholder-white/50 focus:border-gray-500 focus:ring-gray-500"
                    {...register('email', {required: true})}
                  />
                </div>

                <button className="font-nav mt-5 flex w-full items-center justify-center rounded-md border border-transparent bg-cyan-500 px-5 py-4 text-lg font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-cyan-200 hover:bg-cyan-400">
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
