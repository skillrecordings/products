import React from 'react'
import {useRouter} from 'next/router'
import FancyButton from '@/components/fancy-button'

const SubscribeToReactEmailCourseCta: React.FC<
  React.PropsWithChildren<any>
> = ({children}) => {
  const emailInput = React.useRef<HTMLInputElement | null>(null)
  const nameInput = React.useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  return (
    <div className="mx-auto max-w-screen-md">
      {children}
      <form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault()
          await fetch('/api/subscribe-email-course', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: nameInput.current?.value,
              email_address: emailInput.current?.value,
            }),
          }).then(() => router.push('/confirm'))
        }}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name">Your first name</label>
            <input
              className="mt-2 block w-full appearance-none rounded-md border-2 border-er-gray-200 bg-er-gray-100 px-4 py-2 leading-normal focus:shadow-outline focus:outline-none"
              aria-label="Your first name"
              name="fields[first_name]"
              id="first_name"
              placeholder="First name"
              type="text"
              ref={nameInput}
            />
          </div>
          <div>
            <label className="block" htmlFor="email_address">
              Your email address
            </label>
            <input
              className="mt-2 block w-full appearance-none rounded-md border-2 border-er-gray-200 bg-er-gray-100 px-4 py-2 leading-normal focus:shadow-outline focus:outline-none"
              required
              aria-label="Your email address"
              name="email_address"
              id="email_address"
              placeholder="Email address"
              type="email"
              ref={emailInput}
            />
          </div>
        </div>
        <div className="mt-5 flex w-full items-center justify-center">
          <FancyButton tag="button" type="submit">
            Join Now
          </FancyButton>
        </div>
      </form>
    </div>
  )
}

export default SubscribeToReactEmailCourseCta
