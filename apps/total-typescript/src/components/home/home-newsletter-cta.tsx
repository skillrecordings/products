import {useRouter} from 'next/router'
import {MDXComponents} from '../mdx'
import Image from 'next/image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import * as React from 'react'
import {SkillLevel} from './use-skill-level'

export const SubscribeToNewsletter = ({level}: {level?: SkillLevel}) => {
  const router = useRouter()
  return (
    <MDXComponents.Section
      className="flex flex-col items-center bg-[#081021] py-40"
      slot={
        <Image
          src="/assets/landing/bg-divider-7.png"
          layout="fill"
          className="pointer-events-none select-none object-contain"
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
      <h2 className="mx-auto max-w-[15ch] text-center font-heading text-4xl font-bold sm:text-5xl lg:text-5xl xl:text-6xl">
        Become a TypeScript Wizard
      </h2>
      <div
        className="relative mx-auto w-full py-16"
        id="primary-newsletter-cta"
      >
        <div className="mx-auto max-w-sm">
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
      <p className="text-center text-gray-400">
        I respect your privacy. Unsubscribe at any time.
      </p>
    </MDXComponents.Section>
  )
}
