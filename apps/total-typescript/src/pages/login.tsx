import React from 'react'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders, signIn} from 'next-auth/react'
import {type LoginTemplateProps} from '@skillrecordings/skill-lesson/templates/login'
import {Button, Input, Label} from '@skillrecordings/ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Heading from '@/components/heading'
import Spinner from '@/components/spinner'

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

const LoginPage: React.FC<LoginTemplateProps> = ({csrfToken, providers}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {prefill} = router.query
  const showLoadingIndicator = Boolean(prefill) && loadingSubscriber

  const {
    register,
    formState: {errors},
  } = useForm({
    values: {
      email: Boolean(prefill) ? subscriber?.email_address : '',
    },
  })

  const {query} = router

  const callbackUrl = query?.callbackUrl ? (query.callbackUrl as string) : '/'

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast.error(query.message as string, {
        icon: '⛔️',
      })
    }
    if (query.error) {
      switch (query.error) {
        case 'OAuthAccountNotLinked':
          toast.error(
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
  const discordProvider = providers.discord

  return (
    <Layout
      meta={{
        title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        ogImage: [
          {
            url: 'https://res.cloudinary.com/total-typescript/image/upload/v1702041929/ts-login-card_2x_g2ltgj.png',
            alt: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
          },
        ],
      }}
      className="flex flex-col items-center pb-24"
    >
      <Heading
        title="Log in"
        className="[&_h1]:text-7xl [&_h1]:sm:text-7xl [&_h1]:lg:text-8xl"
        description="to Total TypeScript"
      />
      <main
        data-login-template=""
        className="flex w-full flex-col items-center px-5"
      >
        {/* <div className="pointer-events-none absolute z-10 -translate-y-52 sm:-translate-x-2 sm:-translate-y-56">
          <Image
            placeholder="blur"
            src={require('../../public/assets/key@2x.png')}
            alt=""
            quality={100}
            width={240}
            height={240}
            priority
            aria-hidden="true"
            className="w-48 sm:w-[240px]"
          />
        </div>
        <h1 data-title="" className="text-balance">
          Log in
          <span data-subtitle="">to {process.env.NEXT_PUBLIC_SITE_TITLE}</span>
        </h1> */}

        {query?.error === 'Verification' ? (
          <p data-verification-error="" className="text-balance">
            That sign in link is no longer valid. It may have been used already
            or it may have expired. Please request a new log in link below.{' '}
            <a
              className="text-primary underline"
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            >
              Click here to email us
            </a>{' '}
            if you need help.
          </p>
        ) : null}
        <form data-form="" method="post" action="/api/auth/signin/email">
          <Label data-label="" htmlFor="email">
            Email address
          </Label>
          <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div data-input-container="">
            <div data-icon="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            {showLoadingIndicator && (
              <div aria-hidden="true" className="absolute right-5 top-1.5">
                <Spinner className="w-3 text-slate-400" />
              </div>
            )}
            <Input
              data-input=""
              id="email"
              type="email"
              required={true}
              placeholder="you@example.com"
              {...register('email', {required: true})}
            />
          </div>
          <Button className="h-14 w-full bg-gradient-to-tr from-[#4BCCE5] to-[#8AF7F1] text-base font-semibold">
            Email me a login link
          </Button>
        </form>
        {(githubProvider || discordProvider) && <div data-separator="">or</div>}
        <div data-providers-container="">
          {githubProvider ? (
            <Button
              data-button=""
              variant="outline"
              onClick={() =>
                signIn(githubProvider.id, {
                  callbackUrl,
                })
              }
            >
              <Icon
                className="mr-2 flex items-center justify-center"
                name="Github"
                size="20"
              />
              Log in with {githubProvider.name}
            </Button>
          ) : null}
          {discordProvider ? (
            <Button
              data-button=""
              variant="outline"
              onClick={() =>
                signIn(discordProvider.id, {
                  callbackUrl,
                })
              }
            >
              <Icon
                className="mr-2 flex items-center justify-center"
                name="Discord"
                size="20"
              />
              Log in with {discordProvider.name}
            </Button>
          ) : null}
        </div>
      </main>
    </Layout>
  )
}

// return (
//   <Layout
//     meta={{
//       title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
//       ogImage: [
//         {
//           url: 'https://res.cloudinary.com/total-typescript/image/upload/v1702041929/ts-login-card_2x_g2ltgj.png',
//           alt: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
//         },
//       ],
//     }}
//   >
//     <LoginTemplate
//       csrfToken={csrfToken}
//       providers={providers}
//       title={`Log in`}
//       subtitle={`to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
//       image={
//         <div className="pointer-events-none absolute z-10 -translate-y-52 sm:-translate-x-2 sm:-translate-y-56">
//           <Image
//             placeholder="blur"
//             src={require('../../public/assets/key@2x.png')}
//             alt=""
//             quality={100}
//             width={240}
//             height={240}
//             priority
//             aria-hidden="true"
//             className="w-48 sm:w-[240px]"
//           />
//         </div>
//       }
//     />
//   </Layout>
// )

export default LoginPage
