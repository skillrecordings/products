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
  useConvertkit,
} from '@skillrecordings/convertkit'
import ImageAuthor from '../../public/images/joe-previte.jpeg'
import isEmpty from 'lodash/isEmpty'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import Layout from 'components/app/layout'

//portable
import speakingurl from 'speakingurl'

import {
  PortableTextComponents as PortableTextComponentsProps,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import Refractor from 'react-refractor'
import Spinner from 'components/spinner'
import {Button} from '@skillrecordings/react/dist/components'
import {motion} from 'framer-motion'

const formImage = require('../../public/images/emails/migrate-js-project-to-ts/thumb@2x.png')

type ArticleTemplateProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const PortableTextArticleTemplate: React.FC<
  React.PropsWithChildren<ArticleTemplateProps>
> = ({article, hasSubscribed}) => {
  const {title, description, body, subscribersOnly, date, cta} = article
  const {subscriber, loadingSubscriber} = useConvertkit()

  const ogImage = getOgImage(title)
  const shortDescription =
    description || toPlainText(body).substring(0, 157) + '...'
  const router = useRouter()

  return (
    <Layout
      className="relative"
      meta={{
        ogImage,
        title,
        description: shortDescription,
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <Header title={title} date={date} />
      <main className="mb-36">
        <div className="w-full max-w-screen-sm mx-auto">
          <div className="px-5 pt-10 md:pt-16 lg:px-0">
            <article className="prose md:prose-lg md:prose-code:text-sm max-w-none">
              <PortableText value={body} components={PortableTextComponents} />
              {!hasSubscribed && subscribersOnly && (
                <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-white to-transparent h-80" />
              )}
            </article>
          </div>
        </div>
        <section data-article="">
          {!loadingSubscriber && !subscriber && cta ? (
            <div className="relative flex flex-col items-center px-5 pt-16 pb-16 sm:px-0 md:pt-24 md:pb-32">
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
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Start Using TypeScript Today
                </h2>
                <h3 className="max-w-md pt-2 text-xl text-blue-200 opacity-90">
                  Your quick-start guide to TypeScript
                </h3>
              </div>

              <SubscribeToConvertkitForm
                formId={cta.formId}
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
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
          ) : null}
        </section>
      </main>
    </Layout>
  )
}

export default PortableTextArticleTemplate

const Header: React.FC<
  React.PropsWithChildren<{title: string; date: string}>
> = ({title, date}) => {
  return (
    <header className="relative flex flex-col items-center px-5 pt-16 pb-8 overflow-hidden text-white bg-noise">
      <div className="relative z-10 flex flex-col items-center w-full max-w-screen-md mx-auto">
        <Link passHref href="/articles">
          <a className="relative px-4 py-2 text-sm font-normal text-white transition bg-white bg-opacity-0 rounded-full sm:text-base group hover:text-white hover:bg-opacity-10 opacity-80 hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link>
        <h1 className="max-w-screen-md py-4 pb-16 mx-auto text-3xl font-bold leading-none text-center font-heading sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="flex flex-col items-center justify-between w-full max-w-screen-sm px-5 space-y-3 lg:px-0 md:flex-row md:space-y-0">
          <Author />
          <div className="flex items-center space-x-5">
            <time dateTime={date} className="flex items-center text-sm">
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

const CTAContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <section
      id="subscribe"
      className="relative flex flex-col items-center justify-center px-5 pt-10 pb-16 mt-16 overflow-hidden text-white  bg-noise sm:px-16 lg:pb-24 sm:pt-24"
    >
      <div className="flex flex-col items-center max-w-sm pb-8">{children}</div>
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
    <section className="relative z-10 max-w-md p-5 mx-auto mt-16 -translate-y-32 bg-white shadow-2xl rounded-xl md:p-12 sm:p-8">
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
        formId={3071922} // request-article
        className="article"
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        actionLabel="Continue Reading →"
      />
      <p className="px-5 pt-8 text-sm text-center opacity-80">
        No spam. Unsubscribe at any time.
      </p>
    </section>
  )
}

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 transition rounded-full hover:bg-white hover:bg-opacity-10 focus-visible:ring-white'
  const message = `${title} by @jsjoeio`

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
        src={ImageAuthor}
        alt="Joe Previte"
        width={40}
        height={40}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium leading-tight">Joe Previte</span>
    </div>
  )
}

const PortableTextComponents: PortableTextComponentsProps = {
  block: {
    h1: ({children, value}) => {
      return <h1 id={speakingurl(toPlainText(value))}>{children}</h1>
    },
    h2: ({children, value}) => {
      return <h2 id={speakingurl(toPlainText(value))}>{children}</h2>
    },
    h3: ({children, value}) => {
      return <h3 id={speakingurl(toPlainText(value))}>{children}</h3>
    },
    h4: ({children, value}) => {
      return <h4 id={speakingurl(toPlainText(value))}>{children}</h4>
    },
  },
  marks: {
    emoji: ({text, value}: EmojiProps) => {
      const label = value?.emoji?.label || ''
      return (
        <span
          role={label ? 'img' : 'presentation'}
          aria-label={label}
          aria-hidden={!label}
        >
          {text}
        </span>
      )
    },
    internalLink: ({value, children}: InternalLinkProps) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
    link: ({value, children}) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
    code: ({children}) => {
      return (
        <span className="bg-black/50 py-1 px-1 rounded-sm font-mono text-sm text-[#abb2bf]">
          {children}
        </span>
      )
    },
  },
  types: {
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    code: ({value}: CodeProps) => {
      const {language, code, highlightedLines} = value

      return (
        <Refractor
          language={
            language
              ? Refractor.hasLanguage(language)
                ? language
                : 'javascript'
              : 'javascript'
          }
          value={code}
          markers={highlightedLines}
        />
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      const title = getCalloutTitle(type)
      const image = getCalloutImage(type)
      return (
        <div
          className={cx(`p-5 sm:my-8 my-4 rounded-md`, getCalloutStyles(type), {
            'sm:flex': isEmpty(title),
          })}
        >
          <div>
            <span
              role="img"
              aria-label={image.alt}
              className="text-lg font-bold"
            >
              {image.src}
            </span>
            <span className="pl-2 font-semibold">{title}</span>
          </div>
          {/* <b className="font-bold">{getCalloutTitle(type)}</b> */}
          <div className="min-w-0 first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0">
            <PortableText value={body} components={PortableTextComponents} />
          </div>
        </div>
      )
    },
    divider: ({value}: DividerProps) => {
      const {image} = value
      return image ? (
        <div className="flex items-center justify-center pt-10 pb-10">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={300 / 1.2}
            height={30 / 1.2}
          />
        </div>
      ) : (
        <hr />
      )
    },
  },
}

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, image, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image)
    return (
      <figure>
        <span role="img">⚠️</span> missing image
      </figure>
    )
  const {url, width, height} = image
  const Figure = () => {
    return (
      <figure
        className={cx('flex items-center justify-center relative', {
          'bg-gray-100': isLoading,
        })}
      >
        <Image
          onLoadingComplete={() => {
            setIsLoading(false)
          }}
          src={url}
          alt={alt}
          width={width}
          height={height}
          quality={100}
          className="rounded-md"
        />
        {isLoading && <Spinner className="absolute w-8 h-8" />}
        {caption && (
          <figcaption>
            <PortableText value={caption} />
          </figcaption>
        )}
      </figure>
    )
  }
  return href ? (
    <ExternalLink value={{...value, blank: true}} className="flex">
      <Figure />
    </ExternalLink>
  ) : (
    <Figure />
  )
}

const ExternalLink: React.FC<React.PropsWithChildren<ExternalLinkProps>> = ({
  value,
  children,
  ...props
}) => {
  const {blank, href} = value
  return blank ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

type EmojiProps = PortableTextMarkComponentProps<any>
type InternalLinkProps = any
type ExternalLinkProps = any
const getCalloutTitle = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'Tip'
    case 'big-idea':
      return 'Big Idea'
    case 'reflection':
      return 'Reflection'
    case 'caution':
      return 'Caution'
    case 'exercise':
      return 'Exercise'
    case 'link':
      return ''
    default:
      return 'Callout'
  }
}
const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-blue-400/30 text-blue-100'
    case 'big-idea':
      return 'bg-blue-400/70 text-cyan-900'
    case 'reflection':
      return 'bg-orange-400/70 text-orange-800'
    case 'caution':
      return 'bg-pink-400/70 text-pink-900'
    case 'exercise':
      return 'bg-green-400/80 text-yellow-900'
    case 'link':
      return 'bg-yellow-400/80 text-yellow-900'
    default:
      return 'bg-gray-400/70 text-gray-800'
  }
}
const getCalloutImage = (type: string): {alt: string; src: string} => {
  switch (type) {
    case 'tip':
      return {alt: 'light bulp', src: '💡'}
    case 'big-idea':
      return {alt: 'exploding head', src: '🤯'}
    case 'reflection':
      return {alt: 'smiling face with sunglasses', src: '😎'}
    case 'caution':
      return {alt: 'warning', src: '⚠️'}
    case 'exercise':
      return {alt: 'memo', src: '📝'}
    case 'link':
      return {alt: 'waving hand', src: '👋'}
    default:
      return {alt: 'speech baloon', src: '💬'}
  }
}
type DividerProps = {
  value: {image?: string}
}
type CalloutProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    type: string
  }
}

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
  }
}
type BodyImageProps = {
  value: {
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
    link?: string
    image: {
      url: string
      width: number
      height: number
    }
    href?: string
  }
}
