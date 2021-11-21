import * as React from 'react'
import Layout from 'layouts'
import Markdown from 'react-markdown'
import config from '../config'
import isString from 'lodash/isString'
import Image from 'next/image'
import {format} from 'date-fns'
import {ArticleJsonLd} from 'next-seo'
import {
  Twitter,
  Facebook,
  Reddit,
  CopyToClipboard,
  LinkedIn,
  Hacker,
} from 'components/share'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

type ArticleTemplateProps = {
  meta?: any
  footer?: boolean
  subscribeForm?: boolean
}

type AuthorProps = {
  name: string
  image: any
  url: string
}

const ShareArticle: React.FC<{title: string; slug: string}> = ({
  children,
  title,
  slug,
}) => {
  return (
    <div className="flex items-center md:flex-row flex-col md:space-x-2 md:space-y-0 space-y-5">
      {children}
      <div className="flex items-center justify-center flex-wrap md:pb-0">
        <Twitter
          link={`https://${config.siteUrl}/${slug}`}
          message={`${title}, by ${config.twitter.handle}`}
        />
        <Facebook link={`https://${config.siteUrl}/${slug}`} />
        <Reddit
          link={`https://${config.siteUrl}/${slug}`}
          message={`${title}, by ${config.author}`}
        />
        <LinkedIn link={`https://${config.siteUrl}/${slug}`} />
        <Hacker
          link={`https://${config.siteUrl}/${slug}`}
          message={`${title}, by ${config.author}`}
        />
        <CopyToClipboard link={`https://${config.siteUrl}/${slug}`} />
      </div>
    </div>
  )
}

const Author: React.FC<AuthorProps> = ({name, image, url}) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group">
      <div className="relative z-10 flex items-center justify-center">
        <div className="rounded-full border-2 border-orange-300 flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="pl-3 flex flex-col">
          <span className="text-sm text-orange-300 leading-none">
            Article by
          </span>
          <span className="text-lg group-hover:underline">{name}</span>
        </div>
      </div>
    </a>
  )
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  meta,
  children,
  footer = true,
  subscribeForm = true,
}) => {
  const {title, image, published, description, images, background} = meta
  const author = meta.author || {
    name: config.author,
    image: require('../../public/images/sarah-drasner@2x.jpg'),
    imageUrl: 'https://engmanagement.dev/images/sarah-drasner@2x.jpg',
    url: 'https://twitter.com/sarah_edo',
  }
  const dateFormatted = published && format(new Date(published), 'MMMM dd, y')
  const router = useRouter()

  return (
    <Layout
      meta={{
        // todo: add tags field to sanity
        ...meta,
        author,
        url: `https://${config.siteUrl}/${meta.slug}`,
      }}
      className="bg-[#111725]"
    >
      <ArticleJsonLd
        url={`https://${config.siteUrl}/${meta.slug}`}
        title={title}
        // todo: add images field to sanity
        images={images}
        datePublished={published}
        dateModified={published}
        authorName={[author.name]}
        publisherName="EngMangement.dev"
        publisherLogo={author.imageUrl}
        description={description}
      />
      <article>
        <header>
          <div className="pt-40 min-h-[750px] -mx-5 px-5 -mt-5 relative flex flex-col items-center justify-between">
            {title && (
              <h1 className="lg:text-7xl sm:text-6xl text-5xl font-bold font-din uppercase text-center relative z-10 py-8">
                <Markdown>{title}</Markdown>
              </h1>
            )}
            {image && isString(image) ? (
              <Image
                src={image}
                alt=""
                layout="fill"
                className="md:object-contain object-cover object-top"
                quality={100}
                // TODO: enable blurred placeholder
                // placeholder="blur"
                loading="eager"
                priority
              />
            ) : (
              image
            )}
          </div>
          <div className="max-w-screen-sm w-full mx-auto flex md:flex-row flex-col items-center md:justify-between justify-center md:space-y-0 space-y-10 pb-16">
            <Author {...author} />
            <div>
              <ShareArticle title={title} slug={meta.slug}>
                <time
                  className="pr-2 text-xs text-gray-400 opacity-80"
                  dateTime={published}
                >
                  {dateFormatted}
                </time>
              </ShareArticle>
            </div>
          </div>
        </header>
        <div className="relative overflow-hidden -mx-5 px-5">
          <div className="prose prose-dark sm:prose-xl max-w-screen-sm prose-lg mx-auto relative z-10">
            {children}
          </div>
          {background && background}
        </div>
        {footer && (
          <footer className="mx-auto max-w-screen-md flex md:flex-row flex-col md:space-y-0 space-y-10 items-center w-full justify-between pt-24 pb-32">
            <Author {...author} />
            <ShareArticle title={title} slug={meta.slug}>
              <div className="text-sm text-gray-300 opacity-80 pr-2">
                Share with your friends
              </div>
            </ShareArticle>
          </footer>
        )}
        {subscribeForm && (
          <section className="max-w-screen-md w-full mx-auto sm:pb-48 pb-28">
            <div className="flex items-start justify-center ">
              <div className="w-full">
                <h3 className="sm:text-5xl text-4xl font-medium pb-10 leading-none font-din uppercase text-center">
                  Subscribe for More
                </h3>
                <SubscribeToConvertkitForm
                  onSuccess={(subscriber: any) => {
                    if (subscriber) {
                      const redirectUrl = redirectUrlBuilder(
                        subscriber,
                        '/confirm',
                      )
                      router.push(redirectUrl)
                    }
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  )
}

export default ArticleTemplate
