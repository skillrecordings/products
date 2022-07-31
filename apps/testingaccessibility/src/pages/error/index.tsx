import React from 'react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import * as Sentry from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '@skillrecordings/honeycomb-tracer'

export type ErrorType =
  | 'default'
  | 'configuration'
  | 'accessdenied'
  | 'verification'

export interface ErrorProps {
  error?: ErrorType
}

interface ErrorView {
  status: number
  heading: string
  message: JSX.Element
  Signin?: JSX.Element
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  const sessionToken = await getToken({req})

  Sentry.captureMessage(`Auth Error: ${query.error}`)

  if (sessionToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else if (query.error === 'Verification') {
    return {
      redirect: {
        destination: `/login?error=${query.error}`,
        permanent: false,
      },
    }
  } else {
    return {
      props: {...query},
    }
  }
}

const ErrorPage = (props: ErrorProps) => {
  const {error = 'default'} = props

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: 'Error',
      message: (
        <div>
          <p>There is a Something Wrong!</p>
          <p>Please check the error console.</p>
        </div>
      ),
    },
    configuration: {
      status: 500,
      heading: 'Server error',
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p>Check the server logs for more information.</p>
        </div>
      ),
    },
    accessdenied: {
      status: 403,
      heading: 'Access Denied',
      message: (
        <div>
          <p>You do not have permission to sign in.</p>
        </div>
      ),
    },
    verification: {
      status: 403,
      heading: 'Unable to sign in',
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>
            It may have been used already or it may have expired. Visit the log
            in page and enter your email to request a new log in link.
          </p>
        </div>
      ),
    },
  }

  const {
    status,
    heading,
    message,
    Signin = (
      <div>
        <p>
          Please email{' '}
          <a href="mailto:team@testingaccessibility.com">
            team@testingaccessibility.com
          </a>{' '}
          if you need help.
        </p>
        <a className="site button" href="/login">
          You can click here to Log In
        </a>
      </div>
    ),
  } = errors[error.toLowerCase() as ErrorType] ?? errors.default

  return (
    <div className="prose mx-auto mt-16">
      <h1> {heading} </h1>
      <p>
        <br /> {message}
      </p>
      <br />
      {Signin ? Signin : null}
    </div>
  )
}

export default ErrorPage
