import React from 'react'
import Layout from 'components/layout'
import {Signature} from './confirm'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col p-5 min-h-screen bg-blue-600 text-white">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="font-black lg:text-4xl text-3xl py-8 font-heading">
            You're Confirmed!
          </h1>
          <p className="sm:text-lg text-blue-100 leading-relaxed mx-auto pb-8">
            Thanks for confirming your email address — you're all set to receive{' '}
            emails from me about Tailwind.
          </p>
          <Signature />
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return (
    <svg
      className="w-24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 72 71"
    >
      <path
        fill="#64748B"
        d="M36 55.042c-.293 0-.584-.082-.841-.244L.725 32.885a1.568 1.568 0 0 1 .14-2.722L36 8.086l35.134 22.077a1.568 1.568 0 0 1 .14 2.722L36.84 54.798a1.567 1.567 0 0 1-.84.244Z"
      />
      <path
        fill="url(#a)"
        d="M59.477 65.454H12.522V9.107c0-.864.7-1.565 1.565-1.565h43.825c.864 0 1.565.701 1.565 1.565v56.347Z"
      />
      <path
        fill="#7688A2"
        d="M70.433 70.694a1.61 1.61 0 0 1-.394-.05L34.04 61.252l.395-10.906 37.564-18.782v37.564a1.566 1.566 0 0 1-1.565 1.565Z"
      />
      <path
        fill="#8E9EB6"
        d="M70.433 70.694H1.565A1.565 1.565 0 0 1 0 69.128V31.564l71.183 36.19a1.566 1.566 0 0 1-.75 2.94Z"
      />
      <path
        fill="#CBD5E1"
        d="M48.521 24.977H23.478a1.565 1.565 0 1 1 0-3.13h25.043a1.565 1.565 0 1 1 0 3.13Zm-4.174 6.261H27.652c-.576 0-1.044-.7-1.044-1.565 0-.866.468-1.566 1.044-1.566h16.695c.576 0 1.044.7 1.044 1.566 0 .865-.468 1.565-1.044 1.565Z"
      />
      <circle cx="57.912" cy="10.673" r="7.826" fill="#06BA9A" />
      <path
        fill="#fff"
        d="m63.001 7.833-.627-.92c-4.088 1.814-5.876 4.821-5.876 4.821l-2.175-1.211-.853 1.12 3.498 3.544c1.702-4.565 6.033-7.354 6.033-7.354Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1="35.999"
          x2="35.999"
          y1="33.693"
          y2="65.454"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ECF3FF" />
          <stop offset="1" stopColor="#BECBE2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
