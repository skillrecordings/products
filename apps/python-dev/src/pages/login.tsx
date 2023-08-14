import React from 'react'
import {getCsrfToken, getProviders, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Layout from '@/components/app/layout'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Balancer from 'react-wrap-balancer'
import {Button} from '@skillrecordings/ui'

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
    <Layout
      withFooter={false}
      meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
    >
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-start px-5 pb-10 pt-14 sm:justify-center sm:pb-16 sm:pt-0">
        <main className="relative z-10 mx-auto w-full max-w-xl">
          <h1 className="font-text text-center text-3xl font-bold sm:text-4xl">
            Log In
          </h1>
          {query?.error === 'Verification' ? (
            <p className="max-w-sm pt-4 text-center sm:mx-auto sm:w-full sm:pt-10">
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
          <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md sm:pt-10">
            <form method="post" action="/api/auth/signin/email">
              <label
                htmlFor="email"
                className="block pb-1 leading-5 text-gray-700"
              >
                Email address
              </label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500"
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
                  className="mb-3 block w-full rounded-md bg-gray-200 py-4 pl-10 font-medium placeholder:text-gray-500"
                  {...register('email', {required: true})}
                />
              </div>
              <Button size="lg" type="submit">
                Email me a login link
              </Button>
            </form>
          </div>
          {githubProvider ? (
            <div className="flex flex-col items-center sm:text-lg">
              <span className="py-5">or</span>
              <Button
                size="lg"
                variant="ghost"
                onClick={() =>
                  signIn(githubProvider.id, {
                    callbackUrl: '/',
                  })
                }
              >
                <span className="mr-2 flex items-center justify-center">
                  <Icon name="Github" size="20" />
                </span>
                Log in with {githubProvider.name}
              </Button>
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
