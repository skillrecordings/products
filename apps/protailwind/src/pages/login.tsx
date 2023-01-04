import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/layout'
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
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center pb-16 pt-0 sm:p-5 md:pb-40 md:pt-16">
        <main className="relative z-10 rounded-lg border border-gray-800 p-5 shadow-2xl shadow-black/60 sm:mx-auto sm:p-10">
          <h1 className="font-text pt-4 text-center text-3xl font-extrabold leading-9 sm:text-4xl">
            Log in to {process.env.NEXT_PUBLIC_SITE_TITLE}
          </h1>
          {query?.error === 'Verification' ? (
            <p className="mt-4 max-w-sm text-center sm:mx-auto sm:mt-8 sm:w-full">
              That sign in link is no longer valid. It may have been used
              already or it may have expired. Please request a new log in link
              below.{' '}
              <a
                className="inline-flex items-center space-x-1 text-cyan-300 hover:underline"
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              >
                Click here to email us
              </a>{' '}
              if you need help.
            </p>
          ) : null}
          <div className="pt-6 sm:mx-auto sm:w-full sm:max-w-md sm:pt-14">
            <form method="post" action="/api/auth/signin/email">
              <label htmlFor="email" className="block pb-1 text-base leading-5">
                Email address
              </label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-black/50"
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
                  className="mb-3 block w-full rounded-md border border-white border-opacity-20  py-4 pl-10 text-white placeholder-gray-400 focus:border-cyan-300 focus:ring-0"
                  {...register('email', {required: true})}
                />
              </div>
              <button className="group group mt-5 inline-block gap-2 rounded bg-gradient-to-b from-cyan-300 to-cyan-400 py-3 pl-5 pr-8 font-medium text-black transition hover:brightness-110">
                Email me a login link
              </button>
            </form>
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
