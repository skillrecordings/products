import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}} className="sm:p-5 p-2">
      <main className="flex-grow lg:flex-row flex-col flex items-center gap-5 justify-center p-5 bg-brand-bone">
        <Image
          width={580 / 1.2}
          height={794 / 1.2}
          src={require('../../public/assets/greenhouse@2x.png')}
          alt=""
          aria-hidden
          className="lg:w-auto w-80"
        />
        <div className="max-w-screen-sm w-full lg:text-left text-center lg:pr-10">
          {/* <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p> */}
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="sm:text-xl sm:leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
            contacts.
          </p>
          <p className="sm:text-lg">
            Thanks, <br />
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  //TODO: add a signature
  return (
    <svg
      className="lg:mx-0 mx-auto opacity-75"
      xmlns="http://www.w3.org/2000/svg"
      width="94"
      height="43"
      fill="none"
      viewBox="0 0 94 43"
      aria-label="Colt"
    >
      <path
        fill="currentColor"
        d="M10.969 41.121c5.638-.932 16.33-6.85 24.836-14.48a.722.722 0 0 0 .085-1.051c-.315-.337-.75-.352-1.051-.086-8.317 7.47-18.812 13.268-24.113 14.144-3.198.53-4.725-.342-5.087-2.53-1.162-7.026 8.59-22.815 14.732-23.83 1.094-.182 1.577.127 1.793 1.432.188 1.136.017 2.72-.701 5.432-.113.364.132.8.538.905.316.078.8-.132.905-.539.768-2.677.96-4.653.73-6.042-.327-1.977-1.615-2.974-3.34-2.69C12.89 13.012 2.914 29.79 4.166 37.363c.439 2.65 2.385 4.49 6.803 3.759Zm24.73-4.09c2.61-.43 4.915-5.047 5.36-7.325.155-.89.31-2.3.074-3.73 1.709 1.447 3.881 2.038 6.195 1.656 3.198-.529 7.849-2.724 10.985-4.67.35-.23.45-.679.218-1.03a.734.734 0 0 0-1.03-.218c-2.932 1.868-7.303 3.93-10.416 4.445-2.188.362-4.599-.363-6.173-2.307-.161-.19-.393-.281-.687-.233-.42.07-.709.42-.64.841.126.757.397 2.917.03 4.88-.396 2.053-2.518 5.948-4.159 6.22-.462.076-.707-.878-.776-1.299-.39-2.356.662-7.5 3.268-11.605.239-.385.085-.792-.251-.996a.752.752 0 0 0-1.038.258c-2.951 5.156-3.91 9.81-3.452 12.587.209 1.262.978 2.777 2.493 2.527ZM77.785 18.62c-.217-.266-.658-.323-1.002-.05-8.534 7.462-16.372 12.864-19.023 13.303-.336.055-.876-.072-1.008-.87-.056-.337-.013-.863.17-1.585l1.726-6.812c.007.042 7.452-10.352 9.647-16.42.746-2.025-.46-2.258-1.427-2.098-1.55.3-4.182 2.42-5.018 4.157-1.554 3.153-2.827 6.433-4.596 14.03l-1.776 6.776c-.211.813-.303 1.563-.199 2.195.216 1.304 1.336 2.329 2.725 2.1 2.987-.495 11.337-6.197 19.745-13.639a.752.752 0 0 0 .036-1.087ZM63.166 8.891c.647-1.317 2.64-2.857 3.818-3.311-1.512 3.924-4.814 9.31-7.441 13.29 1.443-5.123 2.498-7.632 3.623-9.979Zm13.81 21.316c3.365-.556 8.454-5.072 12.11-8.053a.749.749 0 0 0 .086-1.052c-.266-.302-.75-.351-1.052-.085-2.583 2.156-8.443 7.23-11.388 7.718-.757.125-.742-.829-.58-1.417l4.439-17.072a89.172 89.172 0 0 1 8.723-1.875c.42-.07.66-.455.59-.875-.07-.421-.413-.667-.833-.597a93.424 93.424 0 0 0-8.065 1.679L82.6 2.523a.734.734 0 0 0-.54-.905.734.734 0 0 0-.904.538l-1.797 6.91c-2.265.678-4.264 1.397-6.074 2.215-.4.196-.547.61-.4.974.14.323.413.407.721.442 2.643.298 4.365 1.57 2.872 7.435l-1.769 6.82c-.57 2.298.837 3.492 2.268 3.255Zm1.058-15.821c-.293-1.248-1.232-2.217-2.367-2.548 1.101-.398 2.118-.783 3.318-1.11l-.951 3.658Z"
      />
    </svg>
  )
}
