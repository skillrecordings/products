import React from 'react'
import Layout from 'components/app/layout'
import {getPage} from 'lib/pages'
import type {NextPage} from 'next'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/about-kent'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import LandingCopy from 'components/landing-copy.mdx'

const Index: NextPage<any> = ({page}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout navigationClassName="w-full fixed top-0 sm:text-white">
      <Header />
      <main className="">
        <Article />
        <Subscribe subscriber={subscriber} />
        <AboutKent />
      </main>
    </Layout>
  )
}

const Article = () => {
  return (
    <article className="prose mx-auto max-w-none px-5 pt-16 dark:prose-invert sm:prose-xl md:prose-xl prose-headings:text-center prose-headings:font-bold prose-p:mx-auto prose-p:max-w-2xl">
      <LandingCopy />
    </article>
  )
}

const Header = () => {
  return (
    <header className="relative flex min-h-[108vh] flex-col items-center justify-start bg-black">
      <div className="absolute top-[22vh] z-10 mx-auto text-center xl:top-[190px]">
        <h1 className="max-w-3xl px-5 font-bold text-white fluid-3xl sm:leading-tight lg:px-16">
          <span className="inline-flex pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-orange-300">
            Everything You Need to Know to
          </span>
          <Balancer>Ship Modern Full-Stack Web Applications</Balancer>
        </h1>
      </div>
      <Image
        src={require('../../public/assets/hero/hero.jpg')}
        fill
        className="mx-auto object-cover object-top"
        alt=""
        quality={100}
      />
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent dark:to-background" />
    </header>
  )
}

type SubscribeProps = {
  subscriber: any
}

const Subscribe: React.FC<SubscribeProps> = ({subscriber}) => {
  return (
    <section
      aria-label="Newsletter sign-up"
      className="pb-32 pt-10"
      id="primary-newsletter-cta"
    >
      {!subscriber ? (
        <PrimaryNewsletterCta
          onSubmit={() => {
            track('subscribed from landing page')
          }}
        />
      ) : (
        <div className="text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          You're subscribed <span aria-hidden="true">✧</span> Thanks!
        </div>
      )}
    </section>
  )
}

export default Index
