import type {NextPage} from 'next'
import React from 'react'
import CityScene from 'components/scenes/city'
import Camera from 'components/scenes/city/camera'
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
  return (
    <Layout meta={{titleAppendSiteName: false}} nav>
      <Header />
      <main className="font-light text-slate-300 sm:text-2xl text-xl leading-normal bg-slate-900">
        <Copy />
        <Subscribe />
        <Bio />
      </main>
    </Layout>
  )
}

export default Home

const Header = () => {
  return (
    <header className="relative min-h-[calc(100vh+200px)]">
      <div className="w-full absolute h-screen">
        <Image
          src={require('../../public/assets/city-bg.png')}
          alt=""
          aria-hidden="true"
          layout="fill"
          objectFit="cover"
          quality={50}
          className="opacity-50"
        />
      </div>
      <div className="sticky top-0 min-h-screen">
        <CityScene />
        <HeaderForeground />
        <div className="absolute left-0 bottom-0 w-full h-48 bg-gradient-to-b from-transparent to-slate-900 sm:pointer-events-none" />
      </div>
    </header>
  )
}

const HeaderForeground = () => {
  return (
    <div className="absolute w-full h-full flex items-center text-center justify-center flex-col sm:pointer-events-none">
      <p className="font-display uppercase sm:text-xl text-lg tracking-wide text-amber-400">
        New course by Simon Vrachliotis
      </p>
      <h1 className="pt-3 pb-8 lg:text-8xl md:text-7xl sm:text-6xl text-[3.3rem] leading-none font-heading font-bold max-w-screen-sm">
        Learn to use Tailwind at scale
      </h1>
      <p className="font-light font-display sm:text-3xl text-2xl max-w-md text-slate-200 opacity-80">
        Increase development velocity and craft sustainable systems for your
        team
      </p>
    </div>
  )
}

const Copy = () => {
  return (
    <>
      <p className="max-w-lg mx-auto md:px-0 px-5">
        Beyond understanding the basics of Tailwind CSS and becoming fluent with
        its primitive utilities, in a team environment, you'll eventually ask
        yourself:
      </p>
      <ol className="py-16 px-5 max-w-screen-md mx-auto list-none p-0 divide-y divide-slate-800">
        {questions.map(({body, title, alt}, i) => (
          <li
            key={title}
            className="flex sm:gap-10 gap-6 items-center leading-normal sm:p-10 p-6 m-0 group"
          >
            <span
              aria-hidden="true"
              className="flex-shrink-0 text-4xl font-display font-bold p-2 opacity-50 group-hover:opacity-100 group-hover:text-yellow-500 transition ease-in-out duration-300"
            >
              {alt}
            </span>
            <div className="flex flex-col">
              <span className="leading-normal">{body}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="sm:pb-16 pb-5 mx-auto w-full max-w-screen-sm relative z-10 space-y-10 md:px-0 px-5">
        <p>
          Those are tricky questions.{' '}
          <strong className="text-teal-300 font-semibold">
            The good news?
          </strong>
        </p>
        <p>
          I’m putting together{' '}
          <strong className="font-semibold text-amber-300">Pro Tailwind</strong>
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
          <strong className="font-semibold">power-up your team workflow</strong>{' '}
          with Tailwind CSS, sign up below!
        </p>
        <DividerStar />
      </div>
    </>
  )
}

const Subscribe = () => {
  const router = useRouter()
  return (
    <section className="relative">
      <div className="absolute left-0 bottom-0 overflow-hidden w-full h-[700px]">
        <CityScene camera={<Camera animateOnScroll={false} />} />
        <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-slate-900 to-slate-900/0" />
      </div>
      <div className="pt-10 sm:pb-48 pb-32 px-5 relative w-full flex flex-col items-center justify-center">
        <div className="text-center pb-16">
          <h2 className="font-heading sm:text-6xl text-[2.5rem] leading-none font-bold text-slate-50">
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
  )
}

const Bio = () => {
  return (
    <section className="flex items-center justify-center lg:py-32 sm:py-16 py-10 sm:mt-0 -mt-20 px-5 relative z-10">
      <div className="flex md:flex-row flex-col md:items-start items-center justify-center max-w-screen-sm gap-10">
        <div className="flex-shrink-0 shadow-xl rounded-full flex items-center justify-center ring ring-offset-1 ring-white/10">
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
            👋 Hi, I'm Simon. I'm a hybrid designer, developer, video editor and
            content creator with an optimistic and enthusiastic approach to
            life! Rather than pretending to be a "10×" developer, I take pride
            in helping people around me get more productive ❤️
          </p>
          <p className="pt-4 font-semibold">
            I will be your Pro Tailwind instructor. I'm excited, let's have some
            fun!
          </p>
        </div>
      </div>
    </section>
  )
}

const DividerStar = () => {
  return (
    <div className="pt-8">
      <svg
        className="text-amber-300 mx-auto"
        role="presentation"
        aria-hidden="true"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.0001 0.000167999C13.369 5.15074 13.1601 8.42196 11.9274 10.5329C9.91165 13.1568 6.41815 13.4073 0 14.0001C6.31427 14.7635 9.72775 14.9298 11.7491 17.3337C13.2595 19.4622 13.5144 22.7542 14 28C14.8236 21.1958 14.9527 17.7605 17.9354 15.8047C20.0562 14.7798 23.2215 14.5567 28 14C22.0752 13.2737 18.6385 13.1075 16.5923 11.2974C14.8608 9.23457 14.6771 5.80884 14.0001 0V0.000167999Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
