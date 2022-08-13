import React from 'react'
import {PortableText, toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {CalendarIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'
import {NextRouter, useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'
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

const ArticleTemplate: React.FC<
  React.PropsWithChildren<ArticleTemplateProps>
> = ({article, hasSubscribed}) => {
  const {title, description, body, subscribersOnly, date, cta, byline} = article
  const ogImage = getOgImage({title, byline})
  const shortDescription =
    description || toPlainText(body).substring(0, 157) + '...'
  const router = useRouter()

  return (
    <Layout
      key={title}
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
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <main>
        <Header title={title} date={date} byline={byline} />
        <div>
          <div className="max-w-screen-md mx-auto w-full">
            <div className="md:py-16 py-10">
              <article className="max-w-none prose-p:max-w-screen-md prose-ul:sm:pr-0 prose-ul:pr-5 prose-p:w-full lg:prose-p:px-0 prose-p:px-5 md:prose-headings:px-0 prose-headings:px-5 prose-headings:max-w-screen-sm prose-p:mx-auto prose-headings:mx-auto prose-ul:max-w-screen-sm prose-ul:mx-auto text-gray-800 prose prose-lg prose-h2:max-w-[30ch] prose-h2:font-bold prose-h2:pt-0 prose-headings:py-8 prose-p:font-sans prose-li:font-sans prose-h2:font-heading prose-h3:font-heading prose-h3:font-semibold prose-headings:text-center sm:prose-h3:pt-10 prose-h3:pt-0 sm:prose-h3:pb-14 prose-h3:pb-5 sm:prose-h3:max-w-[35ch] prose-h3:max-w-[30ch] prose-h3:mx-auto lg:prose-xl break-words">
                <PortableText
                  value={body}
                  components={PortableTextComponents}
                />
                {!hasSubscribed && subscribersOnly && (
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent h-80 z-10" />
                )}
              </article>
            </div>
          </div>
          <section data-article="">
            {getCTA({subscribersOnly, hasSubscribed, cta, router})}
          </section>
        </div>
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const Header: React.FC<
  React.PropsWithChildren<{title: string; date: string; byline: string}>
> = ({title, date, byline}) => {
  return (
    <header className="flex flex-col items-center relative px-5 pt-16 pb-8 overflow-hidden text-white bg-green-700 bg-noise">
      <div className="flex flex-col items-center max-w-screen-md mx-auto w-full relative z-10">
        <Link passHref href="/articles">
          <a className="sm:text-base text-sm group text-white relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-10 bg-opacity-0 bg-white rounded-md transition opacity-80 hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link>
        <h1 className="pb-16 max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl py-4">
          {title}
        </h1>
        <div className="lg:px-0 px-5 w-full flex md:flex-row flex-col md:space-y-0 space-y-3 items-center justify-between max-w-screen-sm">
          {byline ? byline : <Author />}
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
    </header>
  )
}

const CTAContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <section
      id="subscribe"
      className="mt-16 relative flex flex-col items-center justify-center overflow-hidden text-white bg-noise bg-green-700 sm:px-16 px-5 lg:pb-24 pb-16 sm:pt-24 pt-10"
    >
      <div className="pb-8 flex flex-col items-center max-w-sm">{children}</div>
    </section>
  )
}

type GetCTAProps = {
  subscribersOnly: boolean
  hasSubscribed: boolean
  cta: {ckFormId: string; body: any; actionLabel: string}
  router: NextRouter
}

const getCTA: React.FC<React.PropsWithChildren<GetCTAProps>> = ({
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
            src={'/assets/email@2x.png'}
            alt=""
            width={300}
            height={180}
            quality={100}
            aria-hidden="true"
          />
          <div className="pt-4 pb-8 flex flex-col items-center prose text-white prose-headings:text-white sm:prose-lg prose-p:leading-normal prose-headings:font-heading prose-p:max-w-[30ch] prose-headings:font-bold lg:prose-headings:font-bold sm:prose-h2:text-4xl text-center">
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
          <div className="pb-8 flex flex-col items-center prose prose-p:max-w-[30ch] prose-headings:font-bold text-center">
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

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
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
      <span className="pl-2 font-medium leading-tight">Marcy Sutton</span>
    </div>
  )
}
