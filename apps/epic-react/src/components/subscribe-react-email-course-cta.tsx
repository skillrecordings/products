import {motion, useReducedMotion} from 'framer-motion'
import axios from 'axios'
import React from 'react'
import {useRouter} from 'next/router'

const SubscribeToReactEmailCourseCta: React.FC<
  React.PropsWithChildren<any>
> = ({children}) => {
  const emailInput = React.useRef<HTMLInputElement | null>(null)
  const nameInput = React.useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  return (
    <div className="mx-auto mb-4 max-w-screen-md">
      {children}
      <form
        className="mt-4"
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
          <FancyButton />
        </div>
      </form>
    </div>
  )
}

export default SubscribeToReactEmailCourseCta

const FancyButton: React.FC<React.PropsWithChildren<any>> = ({children}) => {
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = React.useState(false)

  const hoverStart = {
    left: '0%',
    transition: {duration: 0.4, type: 'spring'},
  }

  const hoverEnd = {
    left: '150%',
    transition: {duration: 0.4, type: 'spring'},
  }

  return (
    <motion.button
      type="submit"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative mt-8 transform overflow-hidden rounded-lg bg-blue-500 px-5 py-3 font-bold text-white transition-all duration-150 ease-in-out hover:scale-110 hover:bg-blue-600 hover:shadow-lg"
    >
      Join Now
      <motion.div
        initial={{
          left: '0%',
          width: 20,
          filter: 'blur(15px)',
          transform: 'skew(-30deg)',
          opacity: 0.5,
        }}
        animate={isHovered && !shouldReduceMotion ? hoverStart : hoverEnd}
        className="absolute left-0 top-0 -ml-8 h-full bg-white"
      />
    </motion.button>
  )
}
