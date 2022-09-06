import React from 'react'
import Spinner from './spinner'
import {Form, useTransition} from '@remix-run/react'

const SubscribeForm: React.FC<any> = ({setStarfieldSpeed}) => {
  const {state} = useTransition()

  return (
    <Form
      method="post"
      className="text-lg flex flex-col w-full max-w-md mx-auto"
    >
      <label className="font-medium inline-block">
        Your name{' '}
        <input
          name="first_name"
          type="text"
          autoComplete="given-name"
          placeholder="Preferred name"
          className="block mt-2 p-5 w-full bg-black"
        />
      </label>
      <label className="font-medium pb-1 inline-block mt-8">
        Email<span className="opacity-70">*</span>{' '}
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="block mt-2 p-5 w-full bg-black"
        />
      </label>
      <button
        disabled={state !== 'idle'}
        type="submit"
        className="mt-10 relative bg-brand text-black p-5 font-bold focus-visible:outline-offset-4 before:absolute before:w-0 hover:before:w-full before:h-full before:bg-amber-300 hover:scale-105 active:scale-100 ease-in-out duration-300 before:transition-all before:ease-in-out before:duration-300 transition-all before:left-0 before:top-0 flex items-center justify-center"
        onMouseOver={() => {
          setStarfieldSpeed(2)
        }}
        onMouseOut={() => {
          setStarfieldSpeed(0.5)
        }}
      >
        <span className="relative z-10">
          {state === 'idle' ? (
            'Become Epic Web Dev'
          ) : (
            <Spinner className="w-6 h-6" />
          )}
        </span>
      </button>
    </Form>
  )
}

export default SubscribeForm
