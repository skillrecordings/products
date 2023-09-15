import Layout from '@/components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from '@/components/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import React from 'react'
import JackImage from '../../public/jack-herrington.jpg'
import Image from 'next/image'
import common from '@/text/common'
import {AnimatedLogo} from '@/components/spinner'

const Home: NextPage = () => {
  return (
    <Layout
      className="overflow-x-hidden"
      navigationProps={{
        className: 'absolute left-0 top-0 h-48 w-full',
      }}
    >
      <Header />
      <main>
        <article className="prose mx-auto w-full max-w-2xl px-5 md:prose-lg">
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

const Header = () => {
  return (
    <header className="relative mx-auto flex w-full flex-col-reverse items-center justify-center gap-10 px-5 py-[15vh] sm:px-10 md:flex-row md:gap-24 lg:px-16">
      <div className="max-w-screen-xl whitespace-nowrap md:-mr-20 md:pb-16">
        <h1 className="max-w-lg text-center text-3xl font-medium sm:text-4xl sm:leading-tight md:text-left lg:text-[2.7rem] lg:leading-tight">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            The <i>No-BS</i> Solution
          </span>{' '}
          <br />
          for Enterprise-Ready <br />
          Next.js Applications
        </h1>
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
      <div className="relative z-10 -mr-10 -mt-4 scale-110 sm:mr-0 sm:mt-0 sm:scale-100">
        <Image
          src={require('../../public/hero.png')}
          className="relative z-10"
          width={2548 / 4}
          height={2549 / 4}
          alt=""
          aria-hidden
          quality={100}
          priority
          placeholder="blur"
        />
        <Image
          src={require('../../public/hero-shadow.png')}
          className="absolute right-0 top-0 mix-blend-multiply"
          width={2548 / 4}
          height={2548 / 4}
          alt=""
          aria-hidden
          quality={100}
          priority
          placeholder="blur"
        />
        <div className="absolute right-0 top-0 -z-10 flex h-[85%] w-[48%] items-end justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#3E75FE]  to-purple-400">
          <Image
            src={require('../../public/grid.png')}
            // fill
            className="absolute mb-10 scale-[2.1] opacity-10 mix-blend-overlay lg:mb-14"
            width={2744}
            height={1041}
            alt=""
            aria-hidden
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
    </header>
  )
}
