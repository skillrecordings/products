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
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import toast, {Toaster} from 'react-hot-toast'

export type EmailCourseTemplateProps = {
  meta: {
    title: string
    headline: string
    description: string
    titleAppendSiteName: boolean
    url: string
    ogImage: string
    formImage: string
    headerBgClassName: string
    formBgClassName: string
    ckFormId?: number
    formHeadline: string
    formSubHeadline: string
    headerImage?: string
  }
}

const EmailCourseTemplate: React.FC<EmailCourseTemplateProps> = ({
  meta,
  children,
}) => {
  const {
    headline,
    formImage,
    headerBgClassName,
    formBgClassName,
    ckFormId,
    formHeadline,
    formSubHeadline,
    headerImage,
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
    <Layout withFooter meta={meta} className="relative">
      <Background className={headerBgClassName} />
      <header className="relative text-center max-w-screen-sm mx-auto md:pt-24 pt-16 md:pb-32 pb-24">
        {/* <Badge /> */}
        {headerImage && <Image src={headerImage} alt={headline} />}
        <h1 className="md:text-5xl text-4xl font-bold py-4 drop-shadow-lg">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{headline}</ReactMarkdown>
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
              <h3 className="text-xl font-light max-w-md pt-2 opacity-90 text-blue-200">
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

export default EmailCourseTemplate

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
  return <div aria-hidden="true" className={className} />
}

const Badge = () => {
  return (
    <div className="mb-2 rounded-full border border-blue-50 border-opacity-10 inline-flex items-center justify-center shadow-xl">
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
        className="items-center justify-center space-x-1 bg-white bg-opacity-10 bg-blend-overlay supports-backdrop-blur:backdrop-blur-sm backdrop-brightness-125 uppercase text-xs font-medium tracking-wide leading-5 rounded-full px-4 py-1.5 inline-flex"
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
        <div className="rounded-r-lg rounded-t-lg px-4 p-3 bg-white supports-backdrop-blur:backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10 relative flex items-center justify-center">
          <div className="absolute left-[-13px] bottom-[-1px] w-0 h-0 border-[6px] rotate-90 border-[rgba(255,255,255,0.14)_rgba(255,255,255,0.14)_transparent_transparent]" />
          <p className="opacity-90">
            Hey, I’m Joe. Your instructor for this TypeScript Course, nice to
            meet you. 😊
          </p>
        </div>
        <div className="rounded-lg px-4 p-3 bg-white supports-backdrop-blur:backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10">
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
