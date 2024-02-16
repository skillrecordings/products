import React from 'react'
import cx from 'classnames'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
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
import mdxComponents from 'components/mdx'

type ArticleTemplateProps = {
  article: Article
  articleBodySerialized: MDXRemoteSerializeResult
}

type HeaderProps = {
  // TODO fix types
  imageUrl: string | null | undefined
  title: string
  author: string
  authorAvatar: string
  publishedDate: string
}

const Header: React.FC<HeaderProps> = ({
  imageUrl,
  title,
  author,
  authorAvatar,
  publishedDate,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-center max-w-5xl mx-auto w-full px-5 lg:space-x-12">
      <div className="w-full max-w-[400px] lg:max-w-none lg:w-[440px] shrink-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="article header image"
            aria-hidden="true"
            width={880}
            height={880}
          />
        )}
      </div>
      <div className="w-full grow">
        <h3
          data-header-label=""
          className="text-badass-cyan-500 font-script text-2xl md:text-3xl lg:text-[2.5rem]"
        >
          Article
        </h3>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] leading-tight md:leading-tight lg:leading-[1.2] mt-2">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="mt-4 lg:mt-6 flex items-center space-x-2">
          {authorAvatar && author && (
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <Image src={authorAvatar} alt={author} width={80} height={80} />
            </div>
          )}
          <div className="font-mono uppercase opacity-70 text-xs lg:text-sm xl:text-base">
            {author} &middot; {format(new Date(publishedDate), 'dd MMMM, y')}
          </div>
        </div>
      </div>
    </header>
  )
}

const ArticleTemplate: React.FC<
  React.PropsWithChildren<ArticleTemplateProps>
> = ({article, articleBodySerialized}) => {
  const {
    title,
    description,
    body,
    _createdAt: publishedDate,
    video,
    image,
    externalImage,
    author,
    authorAvatar,
    // TODO: cleanup unused fields from the scheme
    // shareCardDetails,
    articleHeaderImage,
    shareCardImage,
  } = article
  // const {
  //   title: shareCardTitle,
  //   subtitle: shareCardSubtitle,
  //   image: shareCardImage,
  // } = shareCardDetails

  const shortDescription =
    description || (body && toPlainText(body).substring(0, 157) + '...')

  const shareCardUrlFallback = `${
    process.env.NEXT_PUBLIC_URL
  }/api/og-image/?title=${encodeURI(title)}`

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: shortDescription,
        type: 'article',
        publishedDate,
        article: {
          publishedTime: publishedDate,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`,
        ogImage: {
          url: shareCardImage || shareCardUrlFallback,
        },
      }}
    >
      {/* {articleBodySerialized ? (
        <>
          <Header
            title={title}
            imageUrl={articleHeaderImage}
            author={author}
            authorAvatar={authorAvatar}
            publishedDate={publishedDate}
          />
          <main data-template-article="" className="pb-10">
            <div className="max-w-screen-md lg:max-w-[880px] lg:px-14 mx-auto w-full">
              <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
                <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] mb-2 font-medium">
                  <MDX
                    components={mdxComponents}
                    contents={articleBodySerialized}
                  />
                </article>
              </div>
            </div>
          </main>
        </>
      ) : (
        <> */}
      <ArticleHeader
        title={title}
        publishedDate={publishedDate}
        image={externalImage}
      />
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
      {/* </>
      )} */}
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export default ArticleTemplate

const ArticleHeader: React.FC<
  React.PropsWithChildren<{
    title: string
    publishedDate: string
    image?: any
  }>
> = ({title, publishedDate, image}) => {
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
          <time dateTime={publishedDate} className="flex items-center">
            <CalendarIcon aria-hidden="true" className="w-5" />{' '}
            <span className="sr-only">published on </span>
            <span className="pl-1">
              {format(new Date(publishedDate), 'dd MMMM, y')}
            </span>
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
