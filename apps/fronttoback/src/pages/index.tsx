import React from 'react'
import type {GetServerSideProps, NextPage} from 'next'
import cx from 'classnames'
import LandingCopy from 'components/landing-copy.mdx'
import {useRouter} from 'next/router'
import {useReducedMotion} from 'framer-motion'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit-react-ui'
import toast from 'react-hot-toast'
import Layout from 'components/app/layout'
import AboutInstructor from 'components/about-instructor'
import {getPage} from 'lib/pages'
import {SanityDocument} from '@sanity/client'
import {PortableText} from '@portabletext/react'
import {PortableTextBlock} from '@portabletext/types'
import PortableTextComponents from 'components/portable-text'

const Home: NextPage<SanityDocument> = ({pageData}) => {
  const router = useRouter()
  const {body, description} = pageData
  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

  return (
    <Layout meta={{description}}>
      <Header />
      <Copy body={body} />
      <Subscribe />
      <Footer />
    </Layout>
  )
}

export default Home

const Header = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="bg-brand-orange h-screen flex flex-col justify-end p-[6vw] tracking-tighter relative overflow-hidden">
      <div className="relative z-10 sm:pb-0 pb-20">
        <h1 className="md:text-[11vw] text-[12vw] font-bold leading-none">
          Backend for Frontend Devs
        </h1>
        <h2 className="md:text-[2.5vw] text-lg font-light max-w-[50ch] pt-4 leading-normal">
          An interactive course designed to help JavaScript developers become
          proficient with backend development.
        </h2>
      </div>
      <svg
        className={cx(
          'absolute -right-24 -top-24 text-[#E47A53] sm:w-[500px] w-[400px]',
          {
            'animate-spin-slow': !shouldReduceMotion,
          },
        )}
        viewBox="0 0 564 564"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M307.881 220.567L463.155 65.293L499.324 101.462L344.05 256.736H563.642V307.881L344.05 307.881L499.324 463.155L463.155 499.324L307.881 344.05L307.881 563.642H256.736V344.05L101.462 499.324L65.293 463.155L220.567 307.881H0.97522L0.97522 256.736H220.567L65.293 101.462L101.462 65.293L256.736 220.567V0.97522L307.881 0.97522V220.567Z"
          fill="currentColor"
        />
      </svg>
    </header>
  )
}

const Copy: React.FC<{body: PortableTextBlock}> = ({body}) => {
  return (
    <div className="prose sm:prose-xl prose-lg mx-auto sm:py-20 py-10 lg:px-0 px-5">
      <PortableText value={body} components={PortableTextComponents} />
      {/* <LandingCopy /> */}
    </div>
  )
}

const Subscribe = () => {
  const router = useRouter()
  return (
    <section className="bg-brand-purple sm:py-[10vh] py-16 px-5">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center space-y-7 pb-12">
          <h3 className="lg:text-6xl sm:text-5xl text-4xl leading-none tracking-tight font-bold">
            Become proficient with backend development today!
          </h3>
          <p className="text-xl">
            Sign up for exclusive content and early-release lessons.
          </p>
        </div>
        <SubscribeToConvertkitForm
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
              router.push(redirectUrl)
            }
          }}
          actionLabel="Sign Up Today"
        />
        <p className="text-center pt-12">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <div className="bg-black">
      <div className="text-white grid lg:grid-cols-2 grid-cols-1 p-[6vw] gap-16 max-w-screen-xl mx-auto">
        <div className="prose sm:prose-xl prose-lg prose-p:text-white lg:max-w-md max-w-none">
          <p>
            Becoming proficient with backend development is a game-changer. All
            of the sudden, that black box of knowledge on the server is
            unlocked.
          </p>
          <p>
            Whether you want to architect full-stack applications on your own,
            provide more value across engineering teams, or simply move faster
            with your work—I want to help get you there.
          </p>
          <p>Now let's get to work.</p>
        </div>
        <AboutInstructor />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageData = await getPage('/')

  return {
    props: {pageData},
  }
}
