import React from 'react'
import type {NextPage} from 'next'
import Image from 'next/image'
import cx from 'classnames'
import LandingCopy from 'components/landing-copy.mdx'
import {useRouter} from 'next/router'
import {useReducedMotion} from 'framer-motion'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import toast from 'react-hot-toast'
import Layout from 'components/app/layout'
import {LinkedInIcon, TwitterIcon} from '@skillrecordings/react'

const Home: NextPage = () => {
  const router = useRouter()

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

  return (
    <Layout>
      <Header />
      <Copy />
      <Subscribe />
      <Footer />
    </Layout>
  )
}

export default Home

const Header = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="bg-[#F38D68] min-h-screen flex flex-col justify-end p-[6vw] tracking-tighter relative overflow-hidden">
      <div className="relative z-10">
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
          'absolute -right-24 -top-24 animate-spin text-brand-red sm:w-[500px] w-[400px]',
          {
            'animate-spin': !shouldReduceMotion,
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

const Copy = () => {
  return (
    <div className="prose sm:prose-xl prose-lg mx-auto md:py-24 sm:py-20 py-10 lg:px-0 px-5">
      <LandingCopy />
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
        <div>
          <div className="flex items-center gap-5">
            <div className="rounded-full overflow-hidden flex-shrink-0">
              <Image
                alt="Chance Strickland"
                src="/images/chance-strickland.webp"
                width={140}
                height={140}
                quality={100}
              />
            </div>
            <strong className="sm:text-3xl text-2xl">
              <p>
                Hi! I'm Chance, and I will be your{' '}
                <strong>Front to Back</strong> instructor.
              </p>
            </strong>
          </div>
          <div className="prose sm:prose-xl prose-lg prose-a:text-brand-purple prose-p:text-white max-w-md hover:prose-a:text-[#D2D2FF] prose-a:underline prose-a:underline-offset-2 prose-strong:text-white">
            <div className="space-y-6 w-full">
              <p>
                I am a software engineer building{' '}
                <a
                  href="https://www.radix-ui.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Radix UI
                </a>{' '}
                and the maintainer of{' '}
                <a
                  href="https://reach.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reach UI
                </a>
                . I've also taught hundreds of developers how to build better
                full-stack React apps with{' '}
                <a
                  href="https://reacttraining.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Training
                </a>
                .
              </p>
              <p></p>
            </div>
            <div className="space-x-3 flex items-center  not-prose">
              <a
                href="https://twitter.com/chancethedev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-white transition"
              >
                <TwitterIcon className="w-5 h-5" />
                <span className="sr-only">Chance on Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/in/chaance/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-white transition"
              >
                <LinkedInIcon className="w-5 h-5" />
                <span className="sr-only">Chance on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
