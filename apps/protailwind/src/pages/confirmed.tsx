import React from 'react'
import Layout from 'components/layout'
import {Signature} from './confirm'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            You're Confirmed!
          </h1>
          <p className="sm:text-xl text-slate-300 leading-relaxed mx-auto pb-8">
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
      xmlns="http://www.w3.org/2000/svg"
      className="w-28"
      fill="none"
      viewBox="0 0 72 70"
    >
      <path
        fill="#242E3F"
        d="M36 54.195c-.293 0-.584-.081-.841-.244L.725 32.038a1.568 1.568 0 0 1 .14-2.721L36 7.24l35.134 22.077a1.568 1.568 0 0 1 .14 2.721L36.84 53.951a1.566 1.566 0 0 1-.84.244Z"
      />
      <path
        fill="url(#a)"
        d="M59.477 64.607H12.522V8.26c0-.863.7-1.565 1.565-1.565h43.825c.864 0 1.565.702 1.565 1.565v56.347Z"
      />
      <path
        fill="url(#b)"
        d="M70.433 69.847a1.61 1.61 0 0 1-.394-.05l-36-9.391.395-10.907L72 30.717v37.564a1.569 1.569 0 0 1-1.566 1.566Z"
      />
      <path
        fill="url(#c)"
        d="M70.433 69.847H1.566A1.565 1.565 0 0 1 0 68.28V30.717l71.183 36.19a1.566 1.566 0 0 1-.75 2.94Z"
      />
      <path
        fill="#C4CDDC"
        d="M48.52 24.13H23.479a1.565 1.565 0 1 1 0-3.13h25.043a1.565 1.565 0 1 1 0 3.13Zm-4.173 6.261H27.652c-.576 0-1.044-.7-1.044-1.565 0-.866.468-1.565 1.044-1.565h16.695c.576 0 1.044.7 1.044 1.565 0 .866-.468 1.565-1.044 1.565Z"
      />
      <circle cx="57.912" cy="9.826" r="7.826" fill="#06BA9A" />
      <path
        fill="#fff"
        d="m63.001 6.987-.627-.92c-4.088 1.813-5.876 4.82-5.876 4.82l-2.175-1.21-.853 1.12 3.498 3.544c1.702-4.566 6.033-7.354 6.033-7.354Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1="35.999"
          x2="35.999"
          y1="32.847"
          y2="64.607"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#ECF3FF" />
          <stop offset="1" stop-color="#BECBE2" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="53.019"
          x2="53.019"
          y1="30.717"
          y2="69.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#394456" />
          <stop offset="1" stop-color="#303A4A" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="36"
          x2="36"
          y1="30.717"
          y2="69.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4B586E" />
          <stop offset="1" stop-color="#5C6A82" />
        </linearGradient>
      </defs>
    </svg>
  )
}
