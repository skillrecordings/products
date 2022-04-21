import React from 'react'
import {PortableText, toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {CalendarIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'
import {Wave} from 'components/images'
import {NextRouter, useRouter} from 'next/router'
import {format} from 'date-fns'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import ImageMarcy from '../../public/marcy-sutton.jpg'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import isEmpty from 'lodash/isEmpty'
import Image from 'next/image'
import Link from 'next/link'

type ArticleTemplateProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  article,
  hasSubscribed,
}) => {
  const {title, description, body, subscribersOnly, date, cta, ogImage} =
    article
  const shortDescription =
    description || toPlainText(body).substring(0, 157) + '...'
  const router = useRouter()

  return (
    <Layout
      className="bg-white"
      meta={{
        title,
        description: shortDescription,
        type: 'article',
        date,
        article: {
          publishedTime: date,
        },
        ogImage,
      }}
    >
      <Header title={title} date={date} />
      <div className="max-w-screen-md mx-auto w-full">
        <main className="md:pt-16 pt-10 lg:px-0 px-5">
          <article className="prose md:prose-lg lg:prose-xl max-w-none">
            <PortableText value={body} components={PortableTextComponents} />
            {!hasSubscribed && subscribersOnly && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent h-80 z-10" />
            )}
          </article>
        </main>
      </div>
      <footer data-article="" className="mt-16 py-16 w-full bg-black">
        {getCTA({subscribersOnly, hasSubscribed, cta, router})}
      </footer>
    </Layout>
  )
}

export default ArticleTemplate

const Header: React.FC<{title: string; date: string}> = ({title, date}) => {
  return (
    <header className="md:pt-24 pt-10 sm:pb-16 pb-10 w-full border-b border-gray-200 bg-black text-gray-100 relative">
      <div className="flex flex-col items-center max-w-screen-md mx-auto w-full relative z-10">
        <Link href="/articles">
          <a className="group text-indigo-100 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition-all ease-in-out duration-300 opacity-80 hover:opacity-90 ">
            <span className="pr-1" role="img" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link>
        <h1 className="px-5 sm:pb-28 pb-10 pt-5 md:text-5xl sm:text-4xl text-3xl font-extrabold text-center">
          {title}
        </h1>
        <div className="lg:px-0 px-5 w-full flex md:flex-row flex-col md:space-y-0 space-y-3 items-center justify-between">
          <Author />
          <div className="flex space-x-5 items-center">
            <time dateTime={date} className="text-sm flex items-center">
              <CalendarIcon aria-hidden="true" className="w-4 opacity-80" />{' '}
              <span className="sr-only">published on </span>
              <span className="pl-1">
                {format(new Date(date), 'dd MMMM, y')}
              </span>
            </time>
            <Share title={title} />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-px h-16 w-full overflow-hidden text-white">
        <Wave
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100"
          focusable="false"
          aria-hidden="true"
        />
      </div>
    </header>
  )
}

const CTAContainer: React.FC = ({children}) => {
  return (
    <section className="max-w-md mx-auto rounded-xl bg-white shadow-2xl md:p-12 sm:p-8 p-5">
      <div className="pb-8 flex flex-col items-center">{children}</div>
    </section>
  )
}

type GetCTAProps = {
  subscribersOnly: boolean
  hasSubscribed: boolean
  cta: {ckFormId: string; body: any; actionLabel: string}
  router: NextRouter
}

const getCTA: React.FC<GetCTAProps> = ({
  subscribersOnly,
  hasSubscribed,
  cta,
  router,
}) => {
  switch (true) {
    case subscribersOnly && !hasSubscribed:
      return <ContinueReadingSubscribeForm />
    case isEmpty(cta.ckFormId) && !isEmpty(cta.body):
      return (
        <CTAContainer>
          <div className="prose lg:prose-xl sm:prose-lg prose-p:leading-tight">
            <PortableText
              value={cta.body}
              components={PortableTextComponents}
            />
          </div>
        </CTAContainer>
      )
    case cta.ckFormId === '1863867': // Email Course
      return (
        <CTAContainer>
          <Image
            src={'/assets/mail.svg'}
            alt="email icon"
            width={456 / 4}
            height={356 / 4}
            quality={100}
            aria-hidden="true"
          />
          <div className="pt-4 pb-8 flex flex-col items-center prose lg:prose-xl sm:prose-lg prose-p:text-base prose-p:max-w-[30ch] prose-headings:font-bold text-center">
            <PortableText
              value={cta.body}
              components={PortableTextComponents}
            />
          </div>
          <SubscribeToConvertkitForm
            className="article"
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
            actionLabel={cta.actionLabel}
          />
        </CTAContainer>
      )
    case !isEmpty(cta.ckFormId):
      return (
        <CTAContainer>
          <div className="pb-8 flex flex-col items-center prose lg:prose-xl sm:prose-lg prose-p:text-base prose-p:max-w-[30ch] prose-headings:font-bold text-center">
            <PortableText
              value={cta.body}
              components={PortableTextComponents}
            />
          </div>
          <SubscribeToConvertkitForm
            className="article"
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
            actionLabel={cta.actionLabel}
          />
        </CTAContainer>
      )

    default:
      return null
  }
}

const ContinueReadingSubscribeForm = () => {
  const router = useRouter()
  return (
    <section className="relative z-10 -translate-y-32 max-w-md mx-auto rounded-xl bg-white shadow-2xl md:p-12 sm:p-8 p-5 mt-16">
      <div className="flex flex-col items-center">
        <Image
          src={'/assets/locked-article@2x.png'}
          alt="email icon"
          width={424 / 3.5}
          height={277 / 3.5}
          quality={100}
          aria-hidden="true"
        />
        <h4 className="pt-6 text-3xl font-bold text-center leading-tighter">
          Read the rest of this article
        </h4>
        <p className="text-center pt-4 pb-8 opacity-90 max-w-[30ch] mx-auto">
          This article is for subscribers only. Enter your email to continue
          reading.
        </p>
      </div>
      <SubscribeToConvertkitForm
        formId={3200722} // request-article
        className="article"
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        actionLabel="Continue Reading →"
      />
      <p className="text-sm pt-8 opacity-80 text-center px-5">
        No spam. Unsubscribe at any time.
      </p>
    </section>
  )
}

const Share: React.FC<{title: string}> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full'
  const message = `${title} by @marcysutton`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={ImageMarcy}
        alt="Marcy Sutton"
        width={40}
        height={40}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium md:text-lg leading-tight">
        Marcy Sutton
      </span>
    </div>
  )
}
