import React from 'react'
import Layout from 'components/app/layout'
import {getPage} from 'lib/pages'
import type {NextPage} from 'next'
import {useReducedMotion, motion} from 'framer-motion'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/about-kent'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import LandingCopy from 'components/landing-copy.mdx'

export async function getStaticProps() {
  const page = await getPage('/')

  return {
    props: {page},
    revalidate: 10,
  }
}

const Index: NextPage<any> = ({page}) => {
  const [starfieldSpeed, setStarfieldSpeed] = React.useState(0.5)
  const {body} = page
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout navigationClassName="absolute top-0">
      <Header />
      <main className="">
        <Article body={body} />
        <Subscribe
          subscriber={subscriber}
          setStarfieldSpeed={setStarfieldSpeed}
        />
        <AboutKent />
      </main>
      {/* <Starfield speed={starfieldSpeed} /> */}
    </Layout>
  )
}

const Article: React.FC<{body: any}> = ({body}) => {
  return (
    <article className="prose mx-auto max-w-none px-5 pt-16 dark:prose-invert sm:prose-xl md:prose-xl prose-headings:text-center prose-headings:font-bold prose-p:mx-auto prose-p:max-w-2xl">
      {/* <article className="pt-16 px-5 dark:prose-em:text-gray-200 prose-em:text-gray-800 sm:prose-p:font-light prose max-w-none prose-p:mx-auto md:prose-xl dark:prose-p:text-gray-300 prose-p:text-gray-800 xl:prose-h2:mt-0 sm:prose-xl prose-p:max-w-2xl mx-auto prose-headings:text-center prose-headings:font-normal prose-headings:py-16 xl:prose-headings:fluid-3xl xl:prose-h3:text-3xl prose-h3:pt-0 prose-h3:pb-4 prose-h3:max-w-2xl prose-h3:mx-auto prose-h3:text-left sm:prose-h3:text-2xl prose-h3:text-xl"> */}
      <LandingCopy />
      {/* <PortableText value={body} /> */}
    </article>
  )
}

const Header = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="bg-gradient-radial relative flex min-h-screen flex-col items-center justify-center py-10">
      <div className="relative z-10 mx-auto text-center">
        <h1 className="g:px-16 max-w-3xl px-5 font-bold fluid-3xl sm:leading-tight">
          <span className="inline-flex pb-4 font-mono text-sm font-semibold uppercase tracking-wide text-orange-500 dark:text-yellow-200">
            Everything You Need to Know to
          </span>
          <Balancer>Ship Modern Full-Stack Web Applications</Balancer>
        </h1>
      </div>
      <div className="flex h-full w-full select-none items-center justify-center">
        {/* <Image
          src={require('../../public/assets/hero/planet-background.jpg')}
          alt=""
          className="absolute pointer-events-none xl:block hidden"
          quality={100}
          priority
        />
        <Image
          src={require('../../public/assets/hero/planet-background.jpg')}
          alt=""
          fill
          className="object-cover pointer-events-none xl:hidden block"
          quality={100}
          priority
        /> */}
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src={require('../../public/assets/hero/debris-front.png')}
            alt=""
            className="pointer-events-none absolute"
            width={800}
          />
          <Image
            src={require('../../public/assets/hero/rocket.png')}
            alt=""
            width={700}
            className="pointer-events-none relative z-10"
            quality={100}
            priority
          />
          <Image
            src={require('../../public/assets/hero/debris-back.png')}
            alt=""
            className="pointer-events-none absolute"
            width={700}
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full select-none bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950"
        aria-hidden
      />
    </header>
  )
}

type SubscribeProps = {
  subscriber: any
  setStarfieldSpeed: (speed: number) => void
}

const Subscribe: React.FC<SubscribeProps> = ({
  subscriber,
  setStarfieldSpeed,
}) => {
  return (
    <section
      aria-label="Newsletter sign-up"
      className="pb-24 pt-10 sm:pb-48"
      id="primary-newsletter-cta"
    >
      {!subscriber ? (
        <PrimaryNewsletterCta
          setStarfieldSpeed={setStarfieldSpeed}
          onSubmit={() => {
            track('subscribed from landing page')
          }}
        />
      ) : (
        <div className="text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          You're subscribed{' '}
          <span aria-hidden="true" className="text-brand">
            ✧
          </span>{' '}
          Thanks!
        </div>
      )}
    </section>
  )
}

export default Index
