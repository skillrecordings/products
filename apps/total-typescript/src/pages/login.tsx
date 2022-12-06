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
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center pb-16 pt-0 text-white sm:p-5 md:pb-40 md:pt-16">
        <Image
          src={require('../../public/assets/landing/bg-divider-3.png')}
          layout="fill"
          objectFit="contain"
          objectPosition="top"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none"
        />
        <main className="relative z-10 rounded-lg border border-gray-800 p-5 shadow-2xl shadow-black/60 sm:mx-auto sm:bg-black/20 sm:p-10">
          <Stripes />
          <div className="mx-auto -mt-20 flex w-full max-w-sm items-center justify-center">
            <Image
              placeholder="blur"
              src={require('../../public/assets/gem.png')}
              alt=""
              quality={100}
              width={120}
              height={120}
              priority
              aria-hidden="true"
            />
          </div>
          <h1 className="pt-4 text-center font-text text-3xl font-extrabold leading-9 sm:text-4xl">
            Log in to Total TypeScript
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
              <label
                htmlFor="email"
                className="block pb-1 text-base leading-5 text-gray-200"
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
              <button className="mt-5 flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-b from-cyan-400 to-cyan-500 px-5 py-4 text-lg font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-cyan-100 hover:brightness-110">
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

const Stripes = () => {
  return (
    <svg
      className="absolute left-0 top-0 overflow-hidden rounded-t-lg"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 526 19"
    >
      <mask
        id="a"
        width="525"
        height="18"
        x="1"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{maskType: 'alpha'}}
      >
        <path fill="#060A12" d="M526 18V0H1v18h525Z" />
      </mask>
      <g mask="url(#a)">
        <path
          stroke="#1E293B"
          strokeWidth="1.253"
          d="m413.105 24.159 29.842-29.842m.262 29.842 29.842-29.842m.261 29.842 29.842-29.842m.262 29.842 29.842-29.842M423.263 24.159l29.842-29.842m.262 29.842 29.842-29.842m.261 29.842 29.842-29.842m.262 29.842 29.842-29.842M403.16 24.159l29.842-29.842m.261 29.842 29.842-29.842m.262 29.842 29.842-29.842m.261 29.842 29.842-29.842m.262 29.842 29.842-29.842M393.211 24.159l29.842-29.842m-39.79 29.842 29.842-29.842m-39.791 29.842 29.842-29.842m-39.787 29.842 29.842-29.842m-39.789 29.842 29.842-29.842m-39.792 29.842 29.842-29.842m-39.787 29.842 29.842-29.842M323.58 24.159l29.842-29.842m-39.789 29.842 29.842-29.842m-39.792 29.842 29.842-29.842m-39.789 29.842 29.842-29.842m-39.789 29.842 29.842-29.842m-39.788 29.842 29.843-29.842m-39.792 29.842 29.842-29.842m-39.789 29.842 29.842-29.842m-39.787 29.842 29.842-29.842m-39.792 29.842 29.843-29.842m-39.79 29.842 29.842-29.842m-39.791 29.842 29.842-29.842m-39.787 29.842 29.842-29.842m-39.788 29.842 29.842-29.842m-39.793 29.842 29.842-29.842m-39.787 29.842 29.842-29.842M164.42 24.159l29.842-29.842m-39.788 29.842 29.842-29.842m-39.791 29.842 29.842-29.842m-39.789 29.842L164.42-5.683m-39.789 29.842 29.842-29.842m-39.788 29.842 29.842-29.842m-39.791 29.842 29.842-29.842M94.789 24.159 124.63-5.683M84.844 24.159l29.842-29.842M74.894 24.159l29.842-29.842M64.949 24.159 94.79-5.683M54.998 24.159 84.84-5.683M45.052 24.159 74.894-5.683M35.107 24.159 64.95-5.683M25.158 24.159 55-5.683M15.21 24.159 45.054-5.683M5.261 24.159 35.103-5.683M-4.684 24.159 25.158-5.683m-39.789 29.842L15.21-5.683m-39.79 29.842L5.262-5.683"
        />
      </g>
      <path stroke="#1E293B" d="M0 17.5h526" />
    </svg>
  )
}

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
