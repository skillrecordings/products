import React from 'react'
import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Layout from 'components/layout'
import toast from 'react-hot-toast'
import Simon from '../../public/assets/simon-vrachliotis.png'
import NewsletterSubscribeForm from 'components/subscribe-form'
import LandingCopy from 'components/landing-copy.mdx'

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
    <Layout meta={{titleAppendSiteName: false}}>
      <Header />
      <main>
        <Copy />
        <NewsletterSubscribeForm />
        <Bio />
      </main>
    </Layout>
  )
}

export default Home

const Header = () => {
  return (
    <header className="w-full px-8 pt-10 pb-16 sm:pt-28 sm:pb-28">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-16 md:flex-row">
        <div className="flex w-80 items-center justify-center md:w-auto lg:flex-shrink-0">
          <Image
            src={require('../../public/assets/surfing-corgi.svg')}
            alt=""
            aria-hidden="true"
            quality={100}
            priority
          />
        </div>
        <HeaderContent />
      </div>
    </header>
  )
}

const HeaderContent = () => {
  return (
    <div className="flex w-full flex-col items-center md:items-start">
      <h1 className="mx-auto max-w-[19ch] text-center font-heading text-4xl font-black tracking-tight sm:text-5xl md:ml-0 md:text-left xl:text-6xl">
        Advanced Tailwind CSS{' '}
        <span className="text-brand-red">Concepts & Patterns</span>
      </h1>
      <p className="max-w-sm pt-5 text-center text-lg sm:text-xl md:text-left">
        Increase development velocity and craft sustainable systems for your
        team
      </p>
      <Instructor />
    </div>
  )
}

const Instructor = () => {
  return (
    <div className="flex items-center gap-3 pt-10">
      <div className="flex items-center justify-center overflow-hidden rounded-full">
        <Image
          src={require('../../public/assets/simon-vrachliotis.png')}
          alt="Simon Vrachliotis"
          width={64}
          height={64}
        />
      </div>
      <div>
        New course by
        <div className="font-semibold">Simon Vrachliotis</div>
      </div>
    </div>
  )
}

const Copy = () => {
  return (
    <div className="prose mx-auto w-full max-w-2xl px-5 pb-16 sm:prose-lg md:px-0">
      <LandingCopy />
    </div>
  )
}

const Bio = () => {
  return (
    <section className="relative z-10 -mt-20 flex items-center justify-center py-10 px-5 sm:mt-0 sm:py-16 lg:py-24">
      <div className="flex max-w-screen-sm flex-col items-center justify-center gap-10 md:flex-row md:items-start">
        <div className="flex flex-shrink-0 items-center justify-center rounded-full shadow-xl ring ring-white/10 ring-offset-1">
          <Image
            src={Simon}
            width={150}
            height={150}
            placeholder="blur"
            loading={'eager'}
            alt="Simon Vrachliotis"
          />
        </div>
        <div className="text-lg leading-relaxed">
          <p>
            <span aria-label="waving hand">👋</span> Hi, I'm Simon. I'm a hybrid
            designer, developer, video editor and content creator with an
            optimistic and enthusiastic approach to life! Rather than pretending
            to be a "10×" developer, I take pride in helping people around me
            get more productive ❤️
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
