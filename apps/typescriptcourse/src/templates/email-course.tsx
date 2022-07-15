import * as React from 'react'
import Layout from 'components/app/layout'
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
import {Element} from 'react-scroll'

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

  // TODO fix meta for layout

  return (
    <Layout className="relative">
      <header className="relative max-w-screen-sm px-5 pt-16 pb-24 mx-auto text-center md:pt-24 md:pb-32 md:px-0">
        {headerImage && <Image src={headerImage} alt={headline} />}
        <h1 className="py-4 text-4xl font-bold md:text-5xl drop-shadow-lg">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{headline}</ReactMarkdown>
        </h1>
        <p className="text-lg md:text-xl font-heading opacity-95 text-sky-200">
          Your quick start guide to understanding TypeScript
        </p>
      </header>
      <article>
        <div className="relative max-w-screen-sm px-5 mx-auto prose opacity-90 md:prose-xl md:px-0">
          {children}
        </div>
        <section className="relative px-5 md:px-0">
          <Element name="course" />
          <div className="relative flex flex-col items-center pt-16 pb-16 md:pt-24 md:pb-32">
            <Image
              src={formImage}
              quality={100}
              placeholder="blur"
              loading="eager"
              width={815 / 2}
              height={404 / 2}
              alt="Email course"
            />
            <div className="flex flex-col items-center py-8 text-center">
              <h2 className="text-4xl font-bold">{formHeadline}</h2>
              <h3 className="max-w-md pt-2 text-xl font-light text-blue-200 opacity-90">
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
            <small className="pt-16 text-sm font-light text-blue-100 opacity-60">
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
    <Button className="relative flex items-center justify-center overflow-hidden">
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
        className="absolute top-0 left-0 items-center justify-center w-full h-full space-x-1 tracking-wide uppercase bg-white pointer-events-none bg-opacity-10 bg-blend-overlay "
      />
    </Button>
  )
}
