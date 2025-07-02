import Layout from '@/components/app/layout'

import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/skill-lesson/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {motion} from 'framer-motion'

import {useRouter, type NextRouter} from 'next/router'
import Image from 'next/image'
import {cn} from '@skillrecordings/ui/utils/cn'

export const handleOnSubscribe = (
  router: NextRouter,
  subscriber?: any,
  email?: string,
) => {
  if (subscriber) {
    email && setUserId(email)
    track('subscribed to email list', {
      location: 'newsletter',
      interest: 'effect',
    })
    const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
    router.push(redirectUrl)
  }
}

export default function EffectNewsletter() {
  const title = 'Sign Up to Total Effect Newsletter'
  const router = useRouter()

  const effectInterestField = {
    [`effect_interest`.toLowerCase()]: new Date().toISOString().slice(0, 10),
  }

  return (
    <Layout
      meta={{
        title,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1751469055/total-effect-card_2x.jpg',
        },
        titleAppendSiteName: false,
      }}
      className="w-full"
    >
      <main className="mx-auto mt-16 flex w-full flex-col items-center justify-center">
        <section
          className="flex h-full w-full flex-col items-center px-5 py-16 sm:py-24"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, #1C2434 0%, hsl(var(--background)) 100%)',
          }}
          aria-label="Sign up to Total TypeScript"
        >
          <div className="flex max-w-xl flex-col items-center gap-7 text-center">
            <EffectIcon />
            <h1 className="text-balance font-heading text-4xl font-normal sm:text-5xl">
              <span className="opacity-90">Total</span>{' '}
              <span className="font-extrabold text-white">Effect</span>
            </h1>
            <h2 className="text-balance text-lg font-normal text-slate-300 sm:text-xl">
              I'm thinking about building an Effect course. It'll be the most
              accessible, in-depth resource for Effect out there. Want to be the
              first to know about it? Sign up below. <br />—{' '}
              <Image
                src={require('../../../public/matt-pocock.jpg')}
                alt=""
                aria-hidden="true"
                className="mr-1 inline-block rounded-full"
                priority
                quality={100}
                width={30}
                height={30}
              />
              Matt Pocock
            </h2>
          </div>
          <SubscribeToConvertkitForm
            fields={effectInterestField}
            className="mt-12 flex w-full max-w-[360px] flex-col gap-5 [&_button]:mt-2 [&_button]:h-14 [&_button]:bg-gradient-to-tr [&_button]:from-[#4BCCE5] [&_button]:to-[#8AF7F1] [&_button]:text-base [&_button]:font-semibold [&_input]:h-14 [&_input]:border-[#2B394E] [&_input]:bg-black/30 [&_input]:px-4 [&_input]:text-base [&_input]:shadow-inner [&_input]:transition hover:[&_input]:border-[#3C506D]"
            actionLabel="Sign Up"
            onSuccess={(subscriber?: any, email?: string) => {
              return handleOnSubscribe(router, subscriber, email)
            }}
          />
          <div className="mt-16 inline-flex items-center gap-1">
            <IconSecure />
            <span className="text-sm text-[#A8B8CD]">
              I respect your privacy. Unsubscribe at any time.
            </span>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const IconSecure = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 9C14.5 13.5 8 15.5 8 15.5C8 15.5 1.5 13.5 1.5 9V2.5L8 0.5L14.5 2.5V9Z"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7.5V6C6.5 5.172 7.172 4.5 8 4.5C8.828 4.5 9.5 5.172 9.5 6V7.5"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 7.5H5.5V10.5H10.5V7.5Z"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const EffectIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 overflow-visible"
        //   width="32"
        //   height="32"
        fill="none"
        viewBox="0 0 32 32"
      >
        <motion.path
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: 'easeInOut',
          }}
          fill="#fff"
          fillRule="evenodd"
          d="M29.802 24.317a.957.957 0 0 0 .362-1.322.999.999 0 0 0-1.35-.354l-12.893 7.295-12.846-7.268a.998.998 0 0 0-1.35.355.957.957 0 0 0 .362 1.321L15.39 31.87a1.002 1.002 0 0 0 .768.092c.12-.019.236-.059.342-.119l13.302-7.526Z"
          clipRule="evenodd"
        />
        <motion.path
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.2,
            //   ease: 'easeInOut',
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }}
          fill="#fff"
          fillRule="evenodd"
          d="M31.13 16.601a1.018 1.018 0 0 0-.512-1.052L16.555 7.63a1.06 1.06 0 0 0-.357-.124 1.06 1.06 0 0 0-.812.096L1.323 15.521c-.409.23-.6.69-.499 1.118-.044.352.094.72.504.953l14.062 7.956a1.061 1.061 0 0 0 .813.097c.127-.02.25-.062.361-.125l14.064-7.957c.413-.234.55-.607.502-.962Zm-2.903-.042L15.946 9.645l-12.274 6.91 12.28 6.948 12.275-6.944Z"
          clipRule="evenodd"
        />
        <motion.path
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.4,
            //   ease: 'easeInOut',
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }}
          fill="#fff"
          d="M15.742.008c.145-.017.294-.006.435.034.132.02.26.065.376.131L31.326 8.49c.375.212.573.607.547 1.003.078.432-.12.884-.53 1.117L16.57 18.968a1.12 1.12 0 0 1-.38.13 1.113 1.113 0 0 1-.853-.1L.564 10.64A1.068 1.068 0 0 1 .02 9.603 1.07 1.07 0 0 1 .552 8.46L15.326.144c.128-.073.27-.119.415-.136Z"
        />
      </svg>
    </>
  )
}
