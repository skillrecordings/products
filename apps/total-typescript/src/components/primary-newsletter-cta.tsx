import {NextRouter, useRouter} from 'next/router'
import Image from 'next/image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from 'video/analytics'
import * as React from 'react'
import {SkillLevel} from './home/use-skill-level'
import {MDXComponents} from './mdx'
import {snakeCase} from 'lodash'
import {Article} from 'lib/articles'

const handleOnSuccess = (
  router: NextRouter,
  subscriber?: any,
  email?: string,
) => {
  if (subscriber) {
    email && setUserId(email)
    track('subscribed to email list', {
      location: 'home',
    })
    const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
    router.push(redirectUrl)
  }
}
export const PrimaryNewsletterCta = ({level}: {level?: SkillLevel}) => {
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
          src={require('../../public/assets/landing/scroll-ts@2x.png')}
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
              return handleOnSuccess(router, subscriber, email)
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

export const ArticleNewsletterCta: React.FC<{article?: Article}> = ({
  article,
}) => {
  const router = useRouter()
  const readArticleField = {
    // ex: read_writing_string_replace_in_typescript_on: 2022-09-02
    [`read_${snakeCase(article?.slug)}_on`.toLowerCase()]: new Date()
      .toISOString()
      .slice(0, 10),
  }

  return (
    <div
      id="article-cta"
      className="mx-auto w-full max-w-3xl border-t border-gray-800/80 pt-16"
    >
      <h2 className="text-center font-text text-3xl font-semibold lg:text-4xl">
        Become a TypeScript Wizard
      </h2>
      <p className="mx-auto w-full max-w-xs pt-5 pb-10 text-center text-lg text-cyan-200">
        Stay up-to-date on the latest news and updates from the world of
        TypeScript.
      </p>
      <div className="relative flex items-center justify-center">
        <SubscribeToConvertkitForm
          actionLabel="Subscribe"
          fields={article ? readArticleField : undefined}
          onSuccess={(subscriber?: any, email?: string) => {
            return handleOnSuccess(router, subscriber, email)
          }}
        />
        <PointingArrow />
      </div>
    </div>
  )
}

const PointingArrow = () => {
  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-3 z-0 translate-x-24 md:-top-32 md:-right-12 md:hidden md:translate-x-0 lg:block"
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="177"
      fill="none"
      viewBox="0 0 128 177"
    >
      <circle cx="41.994" cy="146.083" r="1" fill="#EDEDEE" opacity=".3" />
      <circle cx="90.994" cy="102.083" r="1" fill="#EDEDEE" opacity=".4" />
      <circle cx="36.494" cy="96.584" r="1.5" fill="#EDEDEE" opacity=".2" />
      <circle cx="105.994" cy="152.083" r="1" fill="#EDEDEE" opacity=".7" />
      <circle cx="60.494" cy="70.584" r=".5" fill="#EDEDEE" opacity=".4" />
      <circle cx="84.494" cy="153.583" r=".5" fill="#EDEDEE" opacity=".4" />
      <circle cx="75.494" cy="99.584" r=".5" fill="#EDEDEE" opacity=".6" />
      <circle cx="127.494" cy="135.583" r=".5" fill="#EDEDEE" opacity=".6" />
      <circle cx="96.494" cy="173.583" r=".5" fill="#EDEDEE" />
      <circle cx="96.494" cy="138.583" r=".5" fill="#EDEDEE" opacity=".6" />
      <circle cx="63.994" cy="127.083" r="1" fill="#EDEDEE" opacity=".6" />
      <path
        fill="url(#arrow)"
        fillRule="evenodd"
        d="M1.003 17.456c.099-1.1 1.071-.911 2.171-.812C17.464 17.934 35.836 23.97 53.5 34.5c17.657 10.525 33 25 40.352 41.438 8.694 21.792 10.675 41.364 4.053 55.659-6.368 13.745-18.681 24.11-34.316 32.251l4.905 5.652h-20l11.5-16.5 2 7.169c15.092-7.901 26.461-17.689 32.281-30.254 6.033-13.023 6.276-30.406-2.138-51.495-7.026-17.61-22.4-31.95-39.646-42.23C35.252 25.912 23.098 20.226 9.5 19c-1.1-.1-8.598-.444-8.498-1.544Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="arrow"
          x1="43.992"
          x2="55.992"
          y1="26.584"
          y2="164.084"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  )
}
