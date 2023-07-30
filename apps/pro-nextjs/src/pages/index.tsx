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
      <header className="mx-auto flex w-full max-w-screen-lg items-center justify-center text-center">
        <Balancer>
          <h1 className="py-24 text-6xl font-bold">
            The No-BS Solution for Enterprise-Ready Next.js Applications
          </h1>
        </Balancer>
      </header>
      <main>
        <article className="prose mx-auto w-full max-w-2xl px-3 sm:prose-lg">
          <LandingCopy />
          <AboutJack />
        </article>
        <PrimaryNewsletterCta className="pt-20" />
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
        'mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-5 pb-16 sm:gap-16 md:flex-row'
      }
    >
      <Image
        src={JackImage}
        width={200}
        height={200}
        alt="Jack Herrington"
        className="aspect-square rounded-full"
      />

      <div className="text-center md:text-left">
        <p className="pb-3 text-xl font-semibold">{title}</p>
        <p className="text-lg text-gray-800 text-opacity-80 dark:text-gray-300">
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
