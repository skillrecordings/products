import * as React from 'react'
import Image from 'next/image'
import Layout from 'components/app/layout'
import LandingCopy from 'components/landing-copy.mdx'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {MDXComponents} from 'components/mdx'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../utils/analytics'

const HomePage = () => {
  return (
    <Layout meta={{title: `Professional TypeScript Training by Matt Pocock `}}>
      <Header />
      <main>
        <Copy />
        <SubscribeToNewsletter />
      </main>
    </Layout>
  )
}

const Header = () => {
  return (
    <header className="relative flex flex-col items-center justify-center overflow-hidden px-5">
      <div className="relative flex w-full max-w-screen-lg flex-col-reverse items-center lg:min-h-[80vh] lg:flex-row">
        <div className="relative z-10 max-w-2xl pb-10 lg:py-48 lg:pb-48">
          <h1 className="mt-16 max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
            Become the{' '}
            <strong className="font-extrabold">TypeScript Wizard</strong> at
            Your Company
          </h1>
          <h2 className="max-w-[28ch] bg-gradient-to-bl from-teal-200 to-cyan-200 bg-clip-text pt-8 font-text text-lg font-normal text-transparent sm:text-2xl">
            A comprehensive production-grade TypeScript training by{' '}
            <span className="inline-flex items-baseline gap-2 text-white">
              Matt Pocock
            </span>
          </h2>
        </div>
        <div className="-right-40 flex-shrink-0 scale-150 sm:scale-100 lg:absolute">
          <Image
            src={require('../../public/assets/wizard-in-a-cave@2x.png')}
            alt=""
            aria-hidden="true"
            width={890 / 1.15}
            height={960 / 1.15}
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
      <Image
        src={require('../../public/assets/landing/bg-divider-1.png')}
        layout="fill"
        className="pointer-events-none translate-y-48 select-none object-contain object-bottom"
        alt=""
        aria-hidden="true"
      />
    </header>
  )
}

const Copy = () => {
  return (
    <article className="prose-base w-full opacity-90 marker:text-cyan-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:px-5 prose-headings:font-text prose-headings:font-bold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-light prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:list-disc sm:prose-lg md:prose-xl md:prose-h2:text-5xl">
      <LandingCopy />
    </article>
  )
}

const SubscribeToNewsletter = () => {
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
      <div className="relative mx-auto w-full py-16" id="newsletter">
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

export default HomePage
