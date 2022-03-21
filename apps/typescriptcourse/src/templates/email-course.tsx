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
      <header className="relative text-center max-w-screen-sm mx-auto md:pt-24 pt-16 md:pb-32 pb-24">
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
