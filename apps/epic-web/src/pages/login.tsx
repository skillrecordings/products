import * as React from 'react'
import {getCsrfToken, getProviders, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Balancer from 'react-wrap-balancer'
import {Button, Input, Label} from '@skillrecordings/skill-lesson/ui'

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
    <Layout meta={{title: 'Log in to Epic Web'}}>
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-start pb-16 pt-24 sm:p-5 sm:pt-32">
        <main>
          <svg
            className="mx-auto h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 44 44"
          >
            <path
              fill="url(#a)"
              fillRule="evenodd"
              d="M37.353 14.034a17.503 17.503 0 0 1 1.867 7.886c0 9.71-7.9 17.61-17.61 17.61-1.09 0-2.14-.11-3.18-.3.14-12.55 6.82-20.95 6.82-20.95S16.84 24.96 4.3 25.1c-.19-1.03-.3-2.09-.3-3.18 0-9.71 7.9-17.61 17.61-17.61 2.832 0 5.51.672 7.883 1.865L33.72 4.02A21.485 21.485 0 0 0 21.61.3C9.7.3 0 10 0 21.91s9.7 21.61 21.61 21.61 21.61-9.7 21.61-21.61a21.49 21.49 0 0 0-3.713-12.099l-2.154 4.223Z"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              d="m27.3 16.23-1.55-5.32L43.5.03 32.61 17.78l-5.31-1.55Z"
            />
            <defs>
              <linearGradient
                id="a"
                x1="30.56"
                x2="12.71"
                y1="12.96"
                y2="30.82"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#4F75FF" />
                <stop offset="1" stop-color="#30AFFF" />
              </linearGradient>
            </defs>
          </svg>

          <h1 className="font-text pt-3 text-center text-4xl font-extrabold leading-9 sm:pt-8 sm:text-4xl">
            Log in to Epic Web
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
              <Label htmlFor="email">Email address</Label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <Input
                  id="email"
                  type="email"
                  required={true}
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register('email', {required: true})}
                />
              </div>
              <Button className="mt-4 w-full">Email me a login link</Button>
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
