import * as React from 'react'
import {getCsrfToken, getProviders, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Layout from 'layouts'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Balancer from 'react-wrap-balancer'

const Login: React.FC<
  React.PropsWithChildren<{csrfToken: string; providers: any}>
> = ({csrfToken, providers = {}}) => {
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
    if (query.error) {
      switch (query.error) {
        case 'OAuthAccountNotLinked':
          toast(
            'Github account NOT connected. Is it already linked? Try logging out and logging in with Github to check.',
            {
              icon: '⛔️',
            },
          )
          break
      }
    }
  }, [router])

  const githubProvider = providers.github

  return (
    <Layout meta={{title: 'Log in to ScriptKit'}}>
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center pb-16 pt-16 text-white sm:p-5 sm:pt-40 md:pb-40">
        <main className="relative z-10 rounded-lg border-gray-800 p-5 shadow-black/60 sm:mx-auto sm:border sm:bg-gray-800/90 sm:p-10 sm:shadow-2xl">
          <h1 className="pt-3 text-center font-text text-4xl font-extrabold leading-9 sm:pt-8 sm:text-4xl">
            Log in to ScriptKit
          </h1>
          {query?.error === 'Verification' ? (
            <p className="max-w-sm pt-4 text-center sm:mx-auto sm:w-full sm:pt-8">
              <Balancer>
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
              </Balancer>
            </p>
          ) : null}
          <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md sm:pt-10 sm:text-lg">
            <form method="post" action="/api/auth/signin/email">
              <label
                htmlFor="email"
                className="block pb-1 leading-5 text-gray-200"
              >
                Email address
              </label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
                  className="mb-3 block w-full rounded-md border border-white border-opacity-20 bg-gray-900 py-4 pl-10 text-white placeholder-gray-400 focus:border-cyan-300 focus:ring-0"
                  {...register('email', {required: true})}
                />
              </div>
              <button className="mt-5 flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-b from-cyan-400 to-cyan-500 px-5 py-4 font-semibold text-black shadow-xl shadow-black/20 transition focus:outline-none focus:ring-2 focus:ring-cyan-100 hover:brightness-110">
                Email me a login link
              </button>
            </form>
          </div>
          {githubProvider ? (
            <div className="flex flex-col items-center sm:text-lg">
              <span className="py-5">or</span>
              <button
                onClick={() =>
                  signIn(githubProvider.id, {
                    callbackUrl: '/',
                  })
                }
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-700 px-5 py-4 font-semibold text-white shadow-xl shadow-black/20 transition focus:outline-none focus:ring-2 focus:ring-cyan-100 hover:brightness-110"
              >
                <span className="mr-2 flex items-center justify-center">
                  <Icon name="Github" size="20" />
                </span>
                Log in with {githubProvider.name}
              </button>
            </div>
          ) : null}
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
