import type {NextPage} from 'next'
import React from 'react'
import CityScene from 'components/scenes/city'
import Camera from 'components/scenes/city/camera'
import {motion} from 'framer-motion'
import Simon from '../../public/assets/simon-vrachliotis.png'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import Layout from 'components/layout'
import Image from 'next/image'

const questions = [
  {
    title: 'Component library',
    body: 'How do I package and consume a component library using Tailwind CSS?',
    alt: '01.',
  },
  {
    title: 'Monorepo',
    body: 'Is it possible to use Tailwind in a monorepo environment?',
    alt: '02.',
  },
  {
    title: 'Theming',
    body: `What's the best way to support advanced theming, beyond just dark mode?`,
    alt: '03.',
  },
  {
    title: 'Plugins',
    body: `Should I use the plugin API, presets... or both?`,
    alt: '04.',
  },
]

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <Header />
      <main className="font-light text-slate-300 sm:text-2xl text-xl leading-normal bg-slate-900">
        <p className="max-w-lg mx-auto md:px-0 px-5">
          Beyond understanding the basics of Tailwind CSS and becoming fluent
          with its primitive utilities, in a team environment, you'll eventually
          ask yourself:
        </p>
        <motion.ol className="py-16 px-5 max-w-screen-md mx-auto list-none p-0 divide-y divide-slate-800">
          {questions.map(({body, title, alt}, i) => (
            <motion.li
              key={title}
              className="flex gap-10 items-center leading-normal p-10 m-0 group"
            >
              <motion.span
                viewport={{once: true}}
                whileInView={{
                  color: [
                    'rgb(100, 116, 139)',
                    'rgb(245, 158, 11)',
                    'rgb(100, 116, 139)',
                  ],
                }}
                transition={{
                  duration: 1,
                  delay: i / 1.3,
                  repeatDelay: questions.length,
                }}
                aria-hidden="true"
                className="flex-shrink-0 text-4xl font-display font-bold p-2 opacity-70 group-hover:opacity-100 "
              >
                {alt}
              </motion.span>
              <div className="flex flex-col">
                <span className="leading-normal">{body}</span>
              </div>
            </motion.li>
          ))}
        </motion.ol>
        <div className="pb-16 mx-auto w-full max-w-screen-sm relative z-10 space-y-10 md:px-0 px-5">
          <p>
            Those are tricky questions.{' '}
            <strong className="text-teal-300 font-semibold">
              The good news?
            </strong>
          </p>
          <p>
            I’m putting together{' '}
            <strong className="font-semibold text-amber-300">
              Pro Tailwind
            </strong>
            , a course that covers those hard decisions you will face as an
            engineering team.
          </p>
          <p>
            This course{' '}
            <strong className=" font-semibold">
              skips most of the beginner concepts{' '}
            </strong>{' '}
            and focuses heavily on helping you navigate the{' '}
            <strong className=" font-semibold">edge cases</strong> you're likely
            to run into when working on{' '}
            <strong className=" font-semibold">production-grade </strong>
            applications.
          </p>
          <p>I’m excited to work on this, and I can’t wait to tell you more.</p>
          <p>
            If you want to{' '}
            <strong className="font-semibold">
              power-up your team workflow
            </strong>{' '}
            with Tailwind CSS, sign up below!
          </p>
          <p
            className="text-amber-300 text-center text-3xl pt-10"
            aria-hidden="true"
          >
            〜
          </p>
        </div>
        <section className="pt-10 pb-48 relative px-5">
          <div className="absolute left-0 bottom-0 overflow-hidden w-full h-[700px]">
            <CityScene camera={<Camera animateOnScroll={false} />} />
            <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-slate-900 to-slate-900/0" />
          </div>
          <div className="relative w-full flex flex-col items-center justify-center">
            <div className="text-center pb-16">
              <h2 className="font-heading lg:text-5xl text-4xl font-bold text-slate-50">
                Learn to use Tailwind CSS like a pro
              </h2>
              <p className="pt-4 text-indigo-300">
                Sign up for exclusive early-release lessons!
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
            <p className="opacity-80 text-center text-base pt-8">
              I respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center py-16 px-5">
          <div className="flex md:flex-row flex-col md:items-start items-center justify-center max-w-screen-sm gap-10">
            <div className="flex-shrink-0 shadow-xl rounded-full flex items-center justify-center">
              <Image
                src={Simon}
                width={150}
                height={150}
                placeholder="blur"
                loading={'eager'}
                alt="Simon Vrachliotis"
              />
            </div>
            <div className="sm:text-xl text-lg leading-relaxed">
              <p>
                👋 Hi, I'm Simon. I'm a hybrid designer, developer, video editor
                and content creator with an optimistic and enthusiastic approach
                to life! Rather than pretending to be a "10×" developer, I take
                pride in helping people around me get more productive ❤️
              </p>
              <p className="pt-4 font-semibold">
                I will be your Pro Tailwind instructor. I'm excited, let's have
                some fun!
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Home

const Header = () => {
  return (
    <header className="relative min-h-[calc(100vh+200px)]">
      <div className="sticky top-0 min-h-screen">
        <CityScene />
        <div className="absolute w-full h-full flex items-center text-center justify-center flex-col pointer-events-none">
          <p className="font-display uppercase sm:text-xl text-lg tracking-wide text-amber-400">
            New course by Simon Vrachliotis
          </p>
          <h1 className="pt-3 pb-8 lg:text-8xl md:text-7xl text-6xl font-heading font-bold max-w-screen-sm">
            Learn to use Tailwind at scale
          </h1>
          <p className="font-light font-display sm:text-3xl text-2xl max-w-md text-slate-200 opacity-80">
            Increase development velocity and craft sustainable systems for your
            team
          </p>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-48 bg-gradient-to-b from-transparent to-slate-900" />
      </div>
    </header>
  )
}
