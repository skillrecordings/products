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
    <Layout meta={{titleAppendSiteName: false}} nav>
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
    <header className="w-full flex md:flex-row flex-col items-center justify-center sm:pt-48 pt-32 sm:pb-32 pb-24 gap-16 px-8">
      <div className="flex items-center justify-center md:w-auto w-80">
        <Image
          src={require('../../public/assets/surfing-corgi.svg')}
          alt=""
          aria-hidden="true"
          quality={100}
          priority
        />
      </div>
      <HeaderContent />
    </header>
  )
}

const HeaderContent = () => {
  return (
    <div>
      <h1 className="font-black font-heading xl:text-6xl sm:text-5xl text-4xl tracking-tight max-w-[19ch]">
        Advanced Tailwind CSS{' '}
        <span className="text-brand-red">Concepts & Patterns</span>
      </h1>
      <p className="sm:text-xl text-lg pt-5 max-w-sm">
        Increase development velocity and craft sustainable systems for your
        team
      </p>
      <Instructor />
    </div>
  )
}

const Instructor = () => {
  return (
    <div className="pt-10 flex items-center gap-3">
      <div className="flex items-center justify-center rounded-full overflow-hidden">
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
    <div className="prose sm:prose-lg max-w-2xl mx-auto w-full md:px-0 px-5 pb-16">
      <LandingCopy />
    </div>
  )
}

const Bio = () => {
  return (
    <section className="flex items-center justify-center lg:py-24 sm:py-16 py-10 sm:mt-0 -mt-20 px-5 relative z-10">
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
