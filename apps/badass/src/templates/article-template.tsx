import React from 'react'
import cx from 'classnames'
import {PortableText, toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {CalendarIcon} from '@heroicons/react/outline'
import {useRouter} from 'next/router'
import {format} from 'date-fns'
import JoelHooksHeadshotImage from '../../public/joel-hooks.jpg'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import {CallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from '../components/landing-content'
import MuxVideo from '@mux/mux-player-react'
import Balancer from 'react-wrap-balancer'
import type {Article} from 'lib/articles'

type ArticleTemplateProps = {
  article: Article
}

const ArticleTemplate: React.FC<
  React.PropsWithChildren<ArticleTemplateProps>
> = ({article}) => {
  const {
    title,
    description,
    body,
    _createdAt: date,
    video,
    image,
    externalImage,
    shareCardDetails,
  } = article
  const {
    title: shareCardTitle,
    subtitle: shareCardSubtitle,
    image: shareCardImage,
  } = shareCardDetails

  const shortDescription =
    description || (body && toPlainText(body).substring(0, 157) + '...')

  const shareCardUrl =
    shareCardTitle && shareCardSubtitle
      ? `${process.env.NEXT_PUBLIC_URL}/api/og-image/?title=${encodeURI(
          shareCardTitle,
        )}&subtitle=${encodeURI(shareCardSubtitle)}${
          shareCardImage || image ? `&image=${shareCardImage || image}` : ''
        }`
      : shareCardImage && shareCardImage

  const shareCardUrlFallback = `https://badass-ogimage.vercel.app/api/card?title=${title}`

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: shortDescription,
        type: 'article',
        date,
        article: {
          publishedTime: date,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`,
        ogImage: {
          url: shareCardUrl || shareCardUrlFallback,
        },
      }}
    >
      <Header title={title} date={date} image={externalImage} />
      <main className="pb-10">
        <div className="">
          <div className="px-5 pb-16 pt-10 md:pt-16 lg:px-0">
            {video ? (
              <div className="mx-auto w-full max-w-screen-md pb-5">
                <MuxVideo
                  className="aspect-video w-full"
                  playbackId={video.muxPlaybackId}
                  streamType="on-demand"
                />
              </div>
            ) : null}
            <article className="mx-auto w-full max-w-screen-md prose sm:prose-lg lg:prose-xl first-letter:float-left first-letter:-mt-0.5 first-letter:pr-3 first-letter:font-expanded first-letter:text-6xl first-letter:text-badass-pink-500 prose-p:text-neutral-200 prose-code:rounded prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-pre:prose-code:bg-transparent sm:prose-code:text-[80%] md:prose-code:text-sm lg:prose-code:text-[78%]">
              <PortableText value={body} components={PortableTextComponents} />
            </article>
            {video?.transcript ? (
              <section className="w-full max-w-screen-md mx-auto mt-16 md:mt-24">
                <h2 className="font-heading text-3xl leading-tight sm:text-4xl sm:leading-tight text-center">
                  Full Transcript
                </h2>
                <div className="prose sm:prose-base prose-sm prose-p:text-neutral-300 mt-12">
                  <PortableText
                    value={video.transcript}
                    components={PortableTextComponents}
                  />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export default ArticleTemplate

const Header: React.FC<
  React.PropsWithChildren<{
    title: string
    date: string
    image?: any
  }>
> = ({title, date, image}) => {
  return (
    <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-10 pt-5 md:flex-row">
      {image && (
        <div className="w-4/6 md:w-1/2">
          <Image src={image} alt={title} width={628} height={627} />
        </div>
      )}
      <div
        className={cx(
          'flex flex-col items-center',
          image && 'w-full md:w-1/2 md:items-start',
        )}
      >
        <h1
          className={cx(
            'w-full max-w-4xl font-heading text-4xl leading-tight sm:text-5xl sm:leading-tight',
            image ? 'pt-4 text-center md:text-left' : 'pt-16 text-center',
          )}
        >
          <Balancer>{title}</Balancer>
        </h1>
        <div
          className={cx(
            'mt-12 flex w-full items-center gap-7 sm:gap-10',
            image ? 'justify-center md:justify-start' : 'justify-center',
          )}
        >
          <Author />
          <time dateTime={date} className="flex items-center">
            <CalendarIcon aria-hidden="true" className="w-5" />{' '}
            <span className="sr-only">published on </span>
            <span className="pl-1">{format(new Date(date), 'dd MMMM, y')}</span>
          </time>
        </div>
      </div>
    </header>
  )
}

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
  const message = `${title} by @jhooks`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

export const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={JoelHooksHeadshotImage}
        alt="Joel Hooks"
        width={48}
        height={48}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium leading-tight">Joel Hooks</span>
    </div>
  )
}
