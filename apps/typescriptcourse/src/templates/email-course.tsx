import * as React from 'react'
import Layout from 'components/layout'
import {motion} from 'framer-motion'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
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
        <Badge />

        <h1 className="md:text-5xl text-4xl font-bold py-4 drop-shadow-lg">
          {headline}
        </h1>
        <p className="md:text-xl text-lg font-heading opacity-95 text-sky-200">
          Your quick start guide to understanding TypeScript
        </p>
      </header>
      <article>
        <div className="opacity-90 relative prose max-w-screen-sm mx-auto md:prose-xl">
          {children}
        </div>
        <section className="relative">
          <SubscribeBackground />
          <div className="relative flex flex-col items-center md:py-32 py-16">
            <Image
              src={require('../../public/images/emails/migrate-js-project-to-ts/thumb@2x.png')}
              quality={100}
              placeholder="blur"
              loading="eager"
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

const Badge = () => {
  return (
    <div className="mb-2 rounded-full border border-blue-50 border-opacity-10 inline-flex items-center justify-center shadow-xl">
      <motion.div
        transition={{repeat: Infinity, duration: 3, repeatDelay: 1.6}}
        animate={{
          background: [
            'linear-gradient(to right, rgba(255, 255, 255, 0) -50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
            'linear-gradient(to right, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 0.6) 200%, rgba(255, 255, 255, 0) 200%)',
          ],
        }}
        className="items-center justify-center space-x-1 bg-white bg-opacity-10 bg-blend-overlay backdrop-blur-sm backdrop-brightness-125 uppercase text-xs font-medium tracking-wide leading-5 rounded-full px-4 py-1.5 inline-flex"
      >
        <i className="gg-mail scale-75 opacity-75 text-blue-200" />
        <span className="opacity-90">email course</span>
      </motion.div>
    </div>
  )
}

const HeaderBackground = () => {
  return (
    <div className="bg-noise" aria-hidden="true">
      <div className="bg-header" />
    </div>
  )
}

const SubscribeBackground = () => {
  return (
    <div className="bg-noise" aria-hidden="true">
      <div className="bg-subscribe" />
    </div>
  )
}

const Bio = () => {
  return (
    <div className="text-sm flex items-start space-x-2 max-w-md">
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
        <div className="rounded-r-lg rounded-t-lg px-4 p-3 bg-white backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10 relative flex items-center justify-center">
          <div className="absolute left-[-13px] bottom-[-1px] w-0 h-0 border-[6px] rotate-90 border-[rgba(255,255,255,0.14)_rgba(255,255,255,0.14)_transparent_transparent]" />
          <p className="opacity-90">
            Hey, I’m Joe. Your instructor for this TypeScript Course, nice to
            meet you. 😊
          </p>
        </div>
        <div className="rounded-lg px-4 p-3 bg-white backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10">
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
