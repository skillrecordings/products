import {useRouter} from 'next/router'
import {MDXComponents} from '../mdx'
import Image from 'next/image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../../utils/analytics'
import * as React from 'react'

export const SubscribeToNewsletter = ({level}: {level?: string}) => {
  const router = useRouter()
  return (
    <MDXComponents.Section
      className="py-40 bg-[#081021] flex flex-col items-center"
      slot={
        <Image
          src="/assets/landing/bg-divider-7.png"
          layout="fill"
          className="pointer-events-none object-contain select-none"
          objectPosition="top center"
          quality={100}
        />
      }
    >
      <div className="flex items-center justify-center">
        <Image
          src={require('../../../public/assets/landing/scroll-ts@2x.png')}
          quality={100}
          width={650 / 1.8}
          height={650 / 1.8}
          alt=""
          aria-hidden="true"
          placeholder="blur"
        />
      </div>
      <h2 className="xl:text-6xl lg:text-5xl sm:text-5xl text-4xl font-heading font-bold max-w-[15ch] text-center mx-auto">
        Become a TypeScript Wizard
      </h2>
      <div
        className="py-16 w-full mx-auto relative"
        id="primary-newsletter-cta"
      >
        <div className="max-w-sm mx-auto">
          <SubscribeToConvertkitForm
            actionLabel="Subscribe"
            onSuccess={(subscriber?: any, email?: string) => {
              if (subscriber) {
                email && setUserId(email)
                track('subscribed to email list', {
                  location: 'home',
                })
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
          />
        </div>
      </div>
      <p className="text-gray-400 text-center">
        I respect your privacy. Unsubscribe at any time.
      </p>
    </MDXComponents.Section>
  )
}
