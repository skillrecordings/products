import React from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {Button} from '@skillrecordings/react/dist/components'
import {motion} from 'framer-motion'

const formImage = require('../../public/images/emails/migrate-js-project-to-ts/thumb@2x.png')

const SubscribeButton = () => {
  return (
    <Button className="relative flex items-center justify-center overflow-hidden">
      <span className="relative z-10">Start the Course Now! </span>
      <motion.div
        initial={{
          background: 'transparent',
        }}
        aria-hidden="true"
        transition={{
          repeat: Infinity,
          duration: 3,
          repeatDelay: 1.6,
        }}
        animate={{
          background: [
            'linear-gradient(to right, rgba(132, 171, 255, 0) -50%, rgba(132, 171, 255, 0) 0%, rgba(132, 171, 255, 0) 100%)',
            'linear-gradient(to right, rgba(132, 171, 255, 0) 100%, rgb(132, 171, 255, 1) 200%, rgba(132, 171, 255, 0) 200%)',
          ],
        }}
        className="absolute top-0 left-0 items-center justify-center w-full h-full space-x-1 tracking-wide uppercase bg-white pointer-events-none bg-opacity-10 bg-blend-overlay "
      />
    </Button>
  )
}

const Newsletter: React.FunctionComponent<
  React.PropsWithChildren<{
    loadingSubscriber: boolean
    subscriber: any
    cta: any
  }>
> = ({loadingSubscriber, subscriber, cta}) => {
  const router = useRouter()
  return (
    <section data-article="">
      {!loadingSubscriber && !subscriber && cta ? (
        <div className="relative flex flex-col items-center px-5 pt-16 pb-16 sm:px-0 md:pt-24 md:pb-32">
          <Image
            src={formImage}
            quality={100}
            placeholder="blur"
            loading="eager"
            width={815 / 2}
            height={404 / 2}
            alt="Email course"
          />
          <div className="flex flex-col items-center py-8 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Start Using TypeScript Today
            </h2>
            <h3 className="max-w-md pt-2 text-xl text-blue-200 opacity-90">
              Your quick-start guide to TypeScript
            </h3>
          </div>

          <SubscribeToConvertkitForm
            formId={cta.formId}
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
            actionLabel="Start the Course Now!"
            submitButtonElem={SubscribeButton()}
          />
          <small className="pt-16 text-sm font-light text-blue-100 opacity-60">
            We respect your privacy. Unsubscribe at any time.
          </small>
        </div>
      ) : null}
    </section>
  )
}
export default Newsletter
