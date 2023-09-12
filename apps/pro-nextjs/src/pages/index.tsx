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
      <header className="mx-auto flex w-full flex-col-reverse items-center justify-center gap-10 pb-32 pt-16 md:flex-row md:gap-24">
        <div className="max-w-screen-xl ">
          <Balancer>
            <h1 className="max-w-md text-center text-3xl font-medium sm:text-4xl sm:leading-tight md:text-left">
              The <i>No-BS</i> Solution for Enterprise-Ready Next.js
              Applications
            </h1>
          </Balancer>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 md:justify-start">
            With{' '}
            <Image
              src={JackImage}
              width={40}
              height={40}
              priority
              placeholder="blur"
              alt="Jack Herrington"
              className="aspect-square rounded-full"
            />
            <span>Jack Herrington</span>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[65vw] text-gray-200 md:w-[30vw]"
          fill="none"
          viewBox="0 0 30 26"
        >
          <path
            fill="currentColor"
            d="m.56 15.002 5.012 8.696A4.205 4.205 0 0 0 9.206 25.8h4.388L2.754 6.99.56 10.8a4.222 4.222 0 0 0 0 4.203Zm28.88-4.203-5.012-8.697A4.206 4.206 0 0 0 20.794 0h-4.388l10.84 18.809L29.44 15a4.221 4.221 0 0 0 0-4.202Zm-2.762 8.984a3.835 3.835 0 0 1-1.817.454 3.877 3.877 0 0 1-3.346-1.936l-9.506-16.49A3.578 3.578 0 0 0 8.877 0a3.579 3.579 0 0 0-3.132 1.812L3.322 6.017a3.837 3.837 0 0 1 1.817-.454c1.375 0 2.657.742 3.346 1.936l9.506 16.49a3.579 3.579 0 0 0 3.132 1.811 3.578 3.578 0 0 0 3.132-1.812l2.423-4.205Z"
          />
        </svg>
      </header>
      <main>
        <article className="prose prose-lg mx-auto w-full max-w-2xl px-5 md:prose-xl">
          <LandingCopy />
        </article>
        <div className="px-2 pt-10 sm:px-5 sm:pt-20">
          <PrimaryNewsletterCta />
        </div>
        <AboutJack />
      </main>
    </Layout>
  )
}

const AboutJack: React.FC<{title?: string; className?: string}> = ({
  title = 'Meet Your Instructor: Jack Herrington',
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
      <div className="text-center sm:text-left">
        <p className="pb-3 text-xl font-medium">{title}</p>
        <p className="text-gray-600 sm:text-lg sm:leading-relaxed">
          {common['about-instructor']}
        </p>
      </div>
    </section>
  )
}

export default Home
