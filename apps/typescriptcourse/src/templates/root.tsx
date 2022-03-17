import * as React from 'react'
import Layout from 'components/layout'
import {motion} from 'framer-motion'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {Button} from '@skillrecordings/react/dist/components'
import Image from 'next/image'
import type {EmailCourseTemplateProps} from './email-course'
import {Annotation} from 'components/mdx/annotation'

const HomeTemplate: React.FC<EmailCourseTemplateProps> = ({meta, children}) => {
  const {
    headline,
    formImage,
    headerBgClassName,
    formBgClassName,
    ckFormId,
    formHeadline,
    formSubHeadline,
  } = meta
  const router = useRouter()

  return (
    <Layout meta={meta} className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <Background className={headerBgClassName} />
      <header className="relative flex flex-col items-center justify-center text-center mx-auto md:pt-28 pt-16 md:min-h-[70vh] md:pb-32 pb-24 max-w-screen-xl">
        <Badge />
        <h1 className="md:text-5xl text-4xl font-bold py-4 drop-shadow-lg max-w-screen-md">
          Your Quick-Start Guide to Confidently Shipping TypeScript Production
          Code Faster and Safer
        </h1>
        {/* <p className="md:text-xl font-medium text-lg font-heading text-blue-200">
          Your quick start guide to understanding TypeScript
        </p> */}
        <div className="flex items-center justify-center gap-2 pt-2 text-blue-100">
          <div className="flex-shrink-0 border-2 shadow-xl flex items-center justify-center rounded-full overflow-hidden">
            <Image
              src={require('../../public/images/joe-previte.jpeg')}
              alt="Joe Previte"
              quality={100}
              width={40}
              height={40}
              loading="eager"
            />
          </div>
          <span>Joe Previte</span>
        </div>
      </header>
      <article className="relative">
        <div className="bg-landing-article" />
        <div className="opacity-90 relative prose md:prose-p:text-white/90 prose-p:max-w-screen-sm md:prose-p:max-w-screen-sm md:prose-p:mx-auto prose-p:mx-auto md:prose-headings:mx-auto prose-headings:mx-auto w-full md:prose-headings:max-w-screen-sm md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          {children}
        </div>
        <section className="relative pt-4">
          <Background className={formBgClassName} />
          <div className="relative flex flex-col items-center md:pt-24 pt-16 md:pb-32 pb-16">
            <Image
              src={formImage}
              quality={100}
              placeholder="blur"
              loading="eager"
              width={815 / 2}
              height={404 / 2}
              alt="Email course"
            />
            <div className="py-8 text-center flex flex-col items-center">
              <h2 className="text-4xl font-bold">{formHeadline}</h2>
              <h3 className="text-xl max-w-md pt-2 opacity-90 text-blue-200">
                {formSubHeadline}
              </h3>
            </div>
            <SubscribeToConvertkitForm
              formId={ckFormId}
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                  router.push(redirectUrl)
                }
              }}
              actionLabel="Start the Course Now!"
              submitButtonElem={SubscribeButton()}
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

const SubscribeButton = () => {
  return (
    <Button className="relative overflow-hidden flex items-center justify-center">
      <span className="relative z-10">Start the Course Now! </span>
      <motion.div
        initial={{
          background: 'transparent',
        }}
        aria-hidden="true"
        transition={{
          repeat: Infinity,
          duration: 3,
          repeatDelay: 1.6,
        }}
        animate={{
          background: [
            'linear-gradient(to right, rgba(132, 171, 255, 0) -50%, rgba(132, 171, 255, 0) 0%, rgba(132, 171, 255, 0) 100%)',
            'linear-gradient(to right, rgba(132, 171, 255, 0) 100%, rgb(132, 171, 255, 1) 200%, rgba(132, 171, 255, 0) 200%)',
          ],
        }}
        className="absolute left-0 top-0 w-full h-full pointer-events-none items-center justify-center space-x-1 bg-white bg-opacity-10 bg-blend-overlay uppercase tracking-wide "
      />
    </Button>
  )
}

const Background: React.FC<{className: string}> = ({className}) => {
  return (
    <div
      //  className="bg-noise"
      aria-hidden="true"
    >
      <div className={className} />
    </div>
  )
}

const Badge = () => {
  return (
    <div className="mb-2 rounded-full inline-flex items-center justify-center shadow-xl">
      <motion.div
        initial={{
          background: 'transparent',
        }}
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
            courses, and in my free time, I get people excited about webdev and
            indie hacking. 👋
          </p>
        </div>
      </div>
    </div>
  )
}
