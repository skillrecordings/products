import * as React from 'react'
import {ClientSafeProvider, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '../icons'
import Balancer from 'react-wrap-balancer'
import {Button, Input, Label} from '@skillrecordings/ui'

export type LoginTemplateProps = {
  csrfToken: string
  providers: Record<string, ClientSafeProvider>
  image?: React.ReactElement
  title?: string
  subtitle?: string
}

const LoginTemplate: React.FC<React.PropsWithChildren<LoginTemplateProps>> = ({
  csrfToken,
  providers = {},
  image,
  title,
  subtitle,
}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  const router = useRouter()

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
    <main data-login-template="">
      {image ? image : null}
      <h1 data-title="">
        <Balancer>
          {title ? title : `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
        </Balancer>
        {subtitle && <span data-subtitle="">{subtitle}</span>}
      </h1>
      {query?.error === 'Verification' ? (
        <p data-verification-error="">
          <Balancer>
            That sign in link is no longer valid. It may have been used already
            or it may have expired. Please request a new log in link below.{' '}
            <a
              className="text-primary underline"
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            >
              Click here to email us
            </a>{' '}
            if you need help.
          </Balancer>
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
          <Input
            data-input=""
            id="email"
            type="email"
            required={true}
            placeholder="you@example.com"
            {...register('email', {required: true})}
          />
        </div>
        <Button data-button="">Email me a login link</Button>
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
  )
}

export default LoginTemplate

export const CheckYourEmailTemplate: React.FC<{image?: React.ReactElement}> = ({
  image,
}) => {
  React.useEffect(() => {
    toast.success('Check your email', {
      icon: '✉️',
    })
  }, [])

  return (
    <main data-check-your-email="">
      <div data-container="">
        {image ? image : null}
        <h1 data-title="">Check your email</h1>
        <p data-message="">
          A login link will be sent to your email! Use it and you&apos;ll be
          able to access your account.
        </p>
      </div>
    </main>
  )
}
