import Layout from '@/components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from '@/components/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import React from 'react'
import JackImage from '../../public/jack-herrington.jpg'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="mx-auto flex w-full flex-col items-center justify-center pb-16 pt-5 text-center sm:pb-24 sm:pt-14">
        <Image
          src={require('../../public/skyscaper-4.jpg')}
          alt=""
          aria-hidden
          priority
          placeholder="blur"
          width={320}
          height={320}
          quality={100}
          className="mx-auto"
        />
        <div className="max-w-screen-sm">
          <Balancer>
            <h1 className="text-3xl font-medium sm:text-4xl">
              The No-BS Solution for Enterprise-Ready Next.js Applications
            </h1>
          </Balancer>
        </div>
      </header>
      <main>
        <article className="prose prose-lg mx-auto w-full max-w-2xl px-5 md:prose-xl">
          <LandingCopy />
        </article>
        <AboutJack />
        <PrimaryNewsletterCta className="pb-40" />
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
        'mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-5 py-16 sm:gap-16 md:flex-row'
      }
    >
      <Image
        src={JackImage}
        width={200}
        height={200}
        alt="Jack Herrington"
        className="aspect-square rounded-full"
      />

      <div className="text-left">
        <p className="pb-3 text-xl font-normal">{title}</p>
        <p className="font-light leading-relaxed sm:text-lg">
          Jack Herrington is a Full Stack Principal Engineer who orchestrated
          the rollout of React/NextJS at Walmart Labs and Nike. He is also the
          "Blue Collar Coder" on YouTube where he posts weekly videos on
          advanced use of React and NextJS as well as other frontend
          technologies trends. His YouTube channel hosts an entire free courses
          on React and TypeScript. He has written seven books including most
          recently No-BS TypeScript which is a companion book to the YouTube
          course.
        </p>
      </div>
    </section>
  )
}

export default Home
