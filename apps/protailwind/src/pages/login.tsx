import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/legacy/image'
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

  const title = `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`

  return (
    <Layout footer={null} meta={{title}} className="bg-blue-600">
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center p-5 py-40">
        <main className="relative z-10 mb-10 flex w-full max-w-lg flex-col items-center rounded-xl border border-gray-100 bg-white p-8 shadow-2xl shadow-blue-800/50 sm:mx-auto sm:p-14">
          <div className="-mt-40 w-32">
            <Image
              src={require('../../public/assets/waving-corgi.svg')}
              alt="waving corgi"
            />
          </div>
          <h1 className="font-text pt-4 text-center font-heading text-3xl font-extrabold leading-9 sm:text-4xl">
            {title}
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
          <div className="w-full pt-6 sm:mx-auto sm:max-w-md sm:pt-10">
            <form
              method="post"
              action="/api/auth/signin/email"
              className="flex flex-col items-center"
            >
              <label htmlFor="email" className="block w-full pb-1 leading-5">
                Email address
              </label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-blue-500"
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
                  className="block w-full rounded-lg border border-gray-300 border-opacity-20 bg-gray-100 py-3.5 pl-10 placeholder-gray-500 shadow-inner shadow-gray-200 focus:border-blue-500 focus:ring-0"
                  {...register('email', {required: true})}
                />
              </div>
              <button className="group group mt-5 inline-block gap-2 rounded-full bg-blue-600 py-3 px-8 font-medium text-white shadow-md ring-offset-1 transition focus-visible:ring-blue-500 hover:brightness-110">
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
