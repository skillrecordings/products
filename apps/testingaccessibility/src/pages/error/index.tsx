import React from 'react'

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
  signin?: JSX.Element
}

const ErrorPage = (props: ErrorProps) => {
  const {error = 'default'} = props
  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: 'Error',
      message: (
        <p>
          <a className="site" href="/">
            {process.env.NEXT_PUBLIC_URL}
          </a>
        </p>
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
          <p>
            <a className="button" href="/login">
              Sign in
            </a>
          </p>
        </div>
      ),
    },
    verification: {
      status: 403,
      heading: 'Unable to sign in',
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>It may have been used already or it may have expired.</p>
        </div>
      ),
      signin: (
        <p>
          <a className="button" href="/login">
            Sign in
          </a>
        </p>
      ),
    },
  }

  const {status, heading, message, signin} =
    errors[error.toLowerCase() as ErrorType] ?? errors.default

  return (
    <div className="prose mx-auto mt-16">
      <h1> {heading} </h1>
      <p>
        <br /> {message}
      </p>
      <br />
    </div>
  )
}

export default ErrorPage
