import Layout from 'components/layout'
import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import Button from '@skillrecordings/react/dist/components/button'
import {useRouter} from 'next/router'
import Noise from '../../public/images/backgrounds/header-noise.png'
import Image from 'next/image'

type ArticleTemplateProps = {
  meta?: any
}

const HomeTemplate: React.FC<ArticleTemplateProps> = ({meta, children}) => {
  const {headline} = meta
  const router = useRouter()
  return (
    <Layout meta={meta} className="relative">
      <HeaderBackground />
      <header className="relative text-center max-w-screen-sm mx-auto md:pt-48 pt-36 md:pb-40 pb-24">
        <div className="items-center justify-center space-x-2 bg-white bg-opacity-10 bg-blend-overlay backdrop-blur-sm backdrop-brightness-110 uppercase mb-2 text-xs font-medium tracking-wide leading-5 rounded-full px-4 py-1.5 border border-white border-opacity-20 inline-flex">
          <EmailIcon />
          <span>email course</span>
        </div>
        <h1 className="md:text-5xl text-4xl font-bold py-4">{headline}</h1>
        <p className="md:text-xl text-lg font-heading opacity-95 text-sky-200">
          Your quick start guide to understanding TypeScript
        </p>
      </header>
      <article>
        <div className="opacity-90 relative prose dark:prose-dark max-w-screen-sm mx-auto md:prose-xl dark:prose-li:marker:text-teal-400 dark:prose-li:list-outside dark:prose-ul:pl-5">
          {children}
        </div>
        <section className="relative">
          <SubscribeBackground />
          <div className="relative flex flex-col items-center py-32">
            <Image
              src={require('../../public/images/emails/migrate-js-project-to-ts/thumb@2x.png')}
              quality={100}
              placeholder="blur"
              width={815 / 2}
              height={404 / 2}
            />
            <div className="py-8 text-center flex flex-col items-center">
              <h2 className="text-4xl font-bold">
                Start Using TypeScript Today
              </h2>
              <h3 className="text-xl max-w-md pt-2 opacity-90 text-blue-200">
                3 email lessons delivered over 3 days that will give you a taste
                of real-world TypeScript!
              </h3>
            </div>
            <SubscribeToConvertkitForm
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                  router.push(redirectUrl)
                }
              }}
              actionLabel="Start the Course Now!"
            />
            <small className="text-sm font-light opacity-60 pt-16 text-blue-100">
              We respect your privacy. Unsubscribe at any time.
            </small>
          </div>
        </section>
      </article>
      <footer className="flex items-center justify-center pb-24">
        <Bio />
      </footer>
    </Layout>
  )
}

export default HomeTemplate

const HeaderBackground = () => {
  return (
    <div
      className="w-full absolute top-0 left-0 h-screen"
      style={{
        backgroundImage: 'url("/images/backgrounds/header-noise.png")',
        objectFit: 'contain',
        objectPosition: 'top center',
      }}
    >
      {/* <Image
        src={Noise}
        alt=""
        aria-hidden="true"
        layout="fill"
        objectFit="contain"
        objectPosition="top center"
        quality={100}
      /> */}
      <div className="bg-header w-full max-h-[1024px] absolute inset-0" />
    </div>
  )
}

const SubscribeBackground = () => {
  return (
    <>
      <Image
        src={Noise}
        alt=""
        aria-hidden="true"
        layout="fill"
        objectFit="contain"
        objectPosition="top center"
        quality={100}
      />
      <div className="bg-subscribe w-full max-h-[1024px] absolute inset-0" />
    </>
  )
}

const EmailIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="10"
      fill="none"
      viewBox="0 0 13 10"
      className="text-sky-100"
    >
      <path
        className="fill-current"
        fillRule="evenodd"
        d="M.024.781l6.337 4.225a.25.25 0 00.278 0L12.976.781A1 1 0 0012 0H1a1 1 0 00-.976.781zM13 2.568L7.47 6.254a1.75 1.75 0 01-1.94 0L0 2.568V8.75a1 1 0 001 1h11a1 1 0 001-1V2.568z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const Bio = () => {
  return (
    <div className="text-sm flex items-start space-x-2 max-w-sm">
      <div className="flex-shrink-0 border-2 border-white border-opacity-90 flex items-center justify-center rounded-full overflow-hidden">
        <Image
          src={require('../../public/images/joe-previte.jpeg')}
          alt="Joe Previte"
          quality={100}
          width={60}
          height={60}
          loading="eager"
        />
      </div>
      <div className="space-y-2">
        <div className="rounded-lg p-3 bg-white backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10">
          <p className="opacity-90 leading-tight">
            Hey, I’m Joe. Your instructor for this TypeScript Course, nice to
            meet you. 😊
          </p>
        </div>
        <div className="rounded-lg p-3 bg-white backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10">
          <p className="text-sm opacity-80">
            I’m an Open Source TypeScript Engineer with a passion for teaching
            and learning. I help developers learn faster through interactive
            courses, and in my free time, I get people excited about web3 and
            indie hacking. 👋
          </p>
        </div>
      </div>
    </div>
  )
}
