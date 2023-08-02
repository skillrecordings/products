import Layout from '@/components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from '@/components/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import React from 'react'
import JackImage from '../../public/jack-herrington.jpg'
import Image from 'next/image'
import common from '@/text/common'

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="mx-auto flex w-full flex-col items-center justify-center pb-16 pt-5 text-center sm:pb-24">
        <Image
          src={require('../../public/skyscaper-4.jpg')}
          alt=""
          aria-hidden
          priority
          placeholder="blur"
          width={350}
          height={350}
          quality={100}
          className="mx-auto"
        />
        <div className="max-w-screen-sm">
          <Balancer>
            <h1 className="text-center text-3xl font-semibold sm:text-4xl">
              The No-BS Solution for Enterprise-Ready Next.js Applications
            </h1>
          </Balancer>
        </div>
      </header>
      <main>
        <article className="prose prose-lg mx-auto w-full max-w-2xl px-5 md:prose-xl">
          <LandingCopy />
        </article>
        <PrimaryNewsletterCta className="pb-10" />
        <AboutJack />
      </main>
    </Layout>
  )
}

const AboutJack: React.FC<{title?: string; className?: string}> = ({
  title = 'About Jack Herrington',
}) => {
  return (
    <section
      className={
        'mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-5 pb-5 pt-5 sm:gap-10 sm:pb-24 sm:pt-24 md:flex-row'
      }
    >
      <Image
        src={JackImage}
        width={200}
        height={200}
        priority
        placeholder="blur"
        alt="Jack Herrington"
        className="aspect-square rounded-full"
      />

      <div className="text-left">
        <p className="pb-3 text-xl font-medium">{title}</p>
        <p className="sm:text-lg sm:leading-relaxed">
          {common['about-instructor']}
        </p>
      </div>
    </section>
  )
}

export default Home
