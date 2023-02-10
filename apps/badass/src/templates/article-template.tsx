import React from 'react'
import {PortableText, toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {CalendarIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {format} from 'date-fns'
import JoelHooksHeadshotImage from '../../public/joel-hooks.jpg'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import {SmallCallToActionForm} from '../components/call-to-action-form'
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
  const {title, description, body, _createdAt: date, video} = article
  console.log({video})
  const shortDescription =
    description || (body && toPlainText(body).substring(0, 157) + '...')

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
          url: `https://badass-ogimage.vercel.app/api/card?title=${title}`,
        },
      }}
    >
      <Header title={title} date={date} />
      <main>
        <div className="max-w-screen-md mx-auto w-full">
          <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
            <article className="prose first-letter:text-6xl first-letter:pr-3 first-letter:-mt-0.5 first-letter:font-expanded first-letter:float-left first-letter:text-badass-pink-500 lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%]">
              {video ? (
                <>
                  <MuxVideo
                    playbackId={video.muxPlaybackId}
                    streamType="on-demand"
                  />
                  <PortableText
                    value={video.transcript}
                    components={PortableTextComponents}
                  />
                </>
              ) : null}
              <PortableText value={body} components={PortableTextComponents} />
            </article>
          </div>
        </div>
        <section data-article="">
          <SmallCallToActionForm content={genericCallToActionContent} />
        </section>
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const Header: React.FC<
  React.PropsWithChildren<{title: string; date: string}>
> = ({title, date}) => {
  return (
    <header className="flex items-center justify-center pt-5 pb-10">
      <div className="flex flex-col items-center px-5">
        <h1 className="max-w-4xl sm:text-5xl text-4xl font-heading sm:leading-tight leading-tight text-center py-16">
          <Balancer>{title}</Balancer>
        </h1>
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-10 pt-10 justify-center items-center w-full">
            <Author />
            <time dateTime={date} className="flex items-center">
              <CalendarIcon aria-hidden="true" className="w-5" />{' '}
              <span className="sr-only">published on </span>
              <span className="pl-1">
                {format(new Date(date), 'dd MMMM, y')}
              </span>
            </time>
          </div>
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
