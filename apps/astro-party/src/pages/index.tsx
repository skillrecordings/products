import React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import Balancer from 'react-wrap-balancer'
import LandingCopy from 'components/landing-copy.mdx'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout
      withFooter={false}
      navigationProps={{
        className:
          'xl:fixed absolute sm:px-10 px-5 top-5 w-full max-w-none text-white sm:justify-start justify-center',
      }}
      className="overflow-hidden bg-brand-primary"
    >
      <header className="relative z-10 mx-auto flex w-full flex-grow flex-col items-center justify-center rounded-lg py-32 text-white">
        <h1 className="max-w-3xl text-center font-heading text-4xl font-black sm:text-5xl lg:text-6xl">
          <Balancer>
            <span className="block pb-4 font-rounded text-xl font-bold uppercase tracking-wide text-brand-yellow sm:text-2xl lg:text-3xl">
              Astro came to party
            </span>{' '}
            Build and ship for the web so fast it sounds fake
          </Balancer>
        </h1>
        <Image
          src={require('../../public/assets/hero-illustration@2x.png')}
          alt=""
          aria-hidden="true"
          width={800}
          height={800}
          quality={100}
          placeholder="blur"
          className="pointer-events-none mt-24 scale-150 select-none sm:mt-0 sm:scale-100"
          priority
        />
      </header>
      <main className="-mx-2 -mt-64 flex flex-col items-center sm:-mt-96">
        <div className="relative flex w-full max-w-4xl flex-col items-center rounded-full border-4 border-black bg-white px-8 pb-96 pt-40 prose-ul:pl-4 prose-li:marker:text-brand-primary sm:mx-auto sm:px-24">
          <div className="relative z-20 flex items-center gap-3 pb-16 font-rounded text-2xl font-semibold leading-none">
            <Image
              className="rounded-full border-[3px] border-black"
              width={100}
              height={100}
              src={require('../../public/jason-lengstorf.png')}
              placeholder="blur"
              priority
              alt="Jason Lengstorf"
            />
            <div>
              <span className="block pl-0.5 text-lg font-medium text-brand-red">
                Learn Astro with
              </span>
              <span>Jason Lengstorf</span>
            </div>
          </div>
          <article className="prose mx-auto w-full max-w-2xl font-sans sm:prose-lg lg:prose-xl first-letter:float-left first-letter:pr-3 first-letter:pt-1.5 first-letter:font-heading first-letter:text-5xl first-letter:font-bold prose-headings:pb-6 prose-headings:text-center prose-headings:font-rounded prose-headings:font-semibold prose-p:text-black prose-li:text-black sm:first-letter:pt-1 sm:first-letter:text-6xl lg:first-letter:pt-0 lg:first-letter:text-7xl">
            <LandingCopy />
          </article>
          <div className="pointer-events-none absolute bottom-0 flex aspect-square w-full max-w-none select-none items-center justify-center overflow-hidden rounded-b-full">
            <Image
              className="absolute bottom-[-38px] max-w-none"
              src={require('../../public/assets/rainbow@2x.png')}
              width={480}
              // fill
              priority
              alt=""
              aria-hidden="true"
            />
          </div>
          <Image
            className="pointer-events-none absolute bottom-[-140px] ml-28 select-none"
            src={require('../../public/assets/ghost-hanging@2x.png')}
            width={270}
            // height={442}
            priority
            alt=""
            aria-hidden="true"
          />
        </div>
        <PrimaryNewsletterCta className="w-full px-5 pb-40 pt-56">
          <h2 className="max-w-3xl pb-10 text-center font-heading text-3xl font-black text-white sm:pb-20 sm:text-4xl lg:text-5xl">
            <Balancer>
              Get the latest Astro tutorials and tips delivered to your inbox.
            </Balancer>
          </h2>
        </PrimaryNewsletterCta>
      </main>
    </Layout>
  )
}

export default Home
