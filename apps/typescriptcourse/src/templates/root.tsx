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
import StarsBackground from 'components/stars-background'
import AnimatedBadge from 'components/mdx/badge'
import toast, {Toaster} from 'react-hot-toast'
import {Element} from 'react-scroll'

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

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

  return (
    <Layout withFooter meta={meta} className="flex flex-col min-h-screen">
      <StarsBackground />
      <header className="pointer-events-none relative flex flex-col items-center justify-center text-center mx-auto md:pt-28 pt-16 md:min-h-[70vh] md:pb-32 pb-24 max-w-screen-xl">
        <AnimatedBadge
          icon={<i className="gg-mail scale-75 opacity-75 text-blue-300" />}
        >
          new email course
        </AnimatedBadge>
        <h1 className="lg:text-5xl md:text-5xl text-3xl font-bold py-8 drop-shadow-lg max-w-screen-md lg:max-w-screen-lg px-8 text-gray-100">
          Your Quick-Start Guide to Confidently Shipping{' '}
          <span className="bg-gradient-to-l from-fuchsia-300 to-blue-400 bg-clip-text text-transparent">
            TypeScript Production Code
          </span>{' '}
          Faster and Safer
        </h1>

        <div className="flex items-center justify-center gap-2 pt-2 text-blue-100">
          <div className="flex-shrink-0 border-2 shadow-xl flex items-center justify-center rounded-full overflow-hidden">
            <Image
              className="rounded-full"
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
        <div className="opacity-90 relative prose md:prose-p:text-white/90 prose-p:px-5 prose-p:max-w-screen-sm md:prose-p:max-w-screen-sm md:prose-p:mx-auto prose-p:mx-auto md:prose-headings:mx-auto prose-headings:mx-auto w-full md:prose-headings:max-w-screen-sm md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          {children}
        </div>
        <section className="relative pt-4">
          <Element name="course" />
          <Background className={formBgClassName} />
          <div className="sm:px-0 px-5 relative flex flex-col items-center md:pt-24 pt-16 md:pb-32 pb-16">
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
              <h2 className="sm:text-4xl text-3xl font-bold">{formHeadline}</h2>
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
      <Toaster />
    </Layout>
  )
}

export default HomeTemplate

const SubscribeButton = () => {
  return (
    <div className="relative">
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
      <svg
        className="rotate-[26deg] sm:absolute hidden -right-24 -top-36 scale-50 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        width="81"
        height="251"
        fill="none"
        viewBox="0 0 81 251"
      >
        <path
          fill="currentColor"
          d="M26.026 236.556c8.195-1.904 16.18-3.597 25.214-5.712-.63 5.501-3.992 8.675-7.774 9.944-11.347 3.809-22.904 7.406-34.67 9.945C2.072 252.214-1.5 247.347.6 240.788c3.362-11.002 7.354-21.793 11.136-32.796.21-.635.42-1.481.84-1.693 1.472-1.058 3.153-1.692 4.834-2.539.63 1.481 2.1 2.962 1.89 4.232-.63 4.443-1.68 8.675-2.52 12.907-.421 2.327-1.051 4.443 0 7.829 2.52-2.328 5.252-4.655 7.774-6.983C74.565 171.387 85.07 95.85 51.24 33.219c-4.412-8.04-9.665-15.446-14.498-23.274-1.681-2.751-3.152-5.502-4.833-8.252C32.33 1.058 32.96.635 33.38 0c1.891.635 4.413.846 5.673 2.327 4.413 4.655 8.826 9.31 12.608 14.6C89.483 69.401 90.954 142.4 54.813 198.894c-6.934 10.791-15.76 20.312-23.744 30.257-1.681 2.116-3.572 3.808-5.463 5.713-.21.423 0 1.058.42 1.692z"
        />
      </svg>
    </div>
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
