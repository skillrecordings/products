import * as React from 'react'
import {Wave} from 'components/images'
import Image from 'next/image'
import LandingCopy from 'components/content/landing-copy.mdx'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import {getSession, useSession} from 'next-auth/react'
import {getToken} from 'next-auth/jwt'
import {GetServerSideProps} from 'next'
import {sanityClient} from '../utils/sanity-client'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import {serialize} from 'next-mdx-remote/serialize'

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const {req} = context

  return {
    props: {
      token: await getToken({req, secret: process.env.NEXTAUTH_SECRET}),
      session: await getSession(context),
    },
  }
}

const Home: React.FC = (props) => {
  const router = useRouter()
  const data = useSession()

  console.log({props, data})
  return (
    <Layout>
      <div>
        <div className="flex flex-col justify-between min-h-screen">
          <header className="relative pb-32 overflow-hidden text-white bg-black pt-14">
            <div className="flex flex-col items-center justify-center w-full">
              <Image
                src={'/assets/a11y@2x.png'}
                width={774 / 2}
                height={540 / 2}
                quality={100}
                priority={true}
                alt="accessibility symbol with colorful gradient in background"
              />
              <Wave
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 w-full transform scale-150 sm:scale-100"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="max-w-screen-sm text-4xl font-bold md:text-6xl leading-tighter">
                  Learn How to Build Accessible Web Apps
                  <br />
                  <span className="mt-5 text-xl text-center text-yellow-300 md:text-2xl">
                    with Marcy Sutton
                  </span>
                </h1>
              </div>
            </div>
          </header>
          <main className="relative z-10 flex-grow w-full pt-8 px-5">
            <article className="max-w-screen-md pt-16 mx-auto prose prose-lg lg:prose-xl">
              <LandingCopy />
            </article>
            <div className="max-w-screen-md mx-auto">
              <AboutMarcy />
            </div>
          </main>
          <footer>
            <div
              id="subscribe"
              className="relative flex flex-col items-center justify-center px-10 py-24 overflow-hidden text-white bg-black sm:px-16 sm:py-40 min-h-60vh"
            >
              <div className="flex flex-col items-center mb-8">
                <Image
                  src={'/assets/mail@2x.png'}
                  alt=""
                  width={456 / 2}
                  height={356 / 2}
                  quality={100}
                />
              </div>
              <h2 className="max-w-screen-lg mx-auto -mt-4 text-4xl font-semibold leading-none text-center sm:text-5xl sm:font-bold sm:mt-0">
                Learn more about building and testing accessible web
                applications.
              </h2>
              <h3 className="pt-6 pb-10 text-2xl font-normal text-center text-yellow-300">
                Join my exclusive 6-part email course, and be notified of
                upcoming live workshops.
              </h3>
              <SubscribeToConvertkitForm
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
                actionLabel="Start Testing Accessibility →"
              />
              <Wave
                preserveAspectRatio="none"
                className="absolute -top-px left-0 w-full transform scale-150 sm:scale-100 rotate-180"
                focusable="false"
                aria-hidden="true"
              />
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  )
}

const AboutMarcy = () => {
  return (
    <div className="flex flex-col items-center py-16 space-y-4 text-center sm:py-24 sm:flex-row sm:items-start sm:text-left sm:space-x-8 sm:space-y-0">
      <div className="flex-shrink-0">
        <Image
          className="rounded-full"
          src={'/marcy-sutton.jpg'}
          width={120}
          height={120}
          quality={100}
          alt="smiling Marcy Sutton holding a cat and standing next to a microphone"
        />
      </div>
      <div>
        <h2 className="text-3xl font-bold">Hi, I'm Marcy Sutton.</h2>
        <p className="mt-2 text-xl leading-relaxed">
          I'm an award-winning accessibility specialist and freelance web
          developer. In this self-paced workshop, you will benefit from my years
          of experience as a senior engineer and educator as you learn how to
          build a culture of accessibility at your organization.
        </p>
      </div>
    </div>
  )
}
export default Home
