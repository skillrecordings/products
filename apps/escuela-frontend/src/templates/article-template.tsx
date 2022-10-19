import React from 'react'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import Image from 'next/image'
import {ClockIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {PortableText, toPlainText} from '@portabletext/react'
import {useConvertkit} from '@skillrecordings/convertkit'
import {SanityDocument} from '@sanity/client'
import {getOgImage} from 'utils/get-og-image'
import {isEmpty} from 'lodash'
import SubscribeForm from 'components/subscribe-form'
import TableOfContents from 'components/portable-text/table-of-contents'

type ArticleTemplateProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({article}) => {
  const {title, description, body, date, related} = article
  const shortDescription =
    description || toPlainText(body).substring(0, 157) + '...'
  const ogImage = getOgImage(title)
  const {subscriber, loadingSubscriber} = useConvertkit()

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
        ogImage,
      }}
    >
      <Header {...article} />
      <main>
        <div className="border-t border-gray-200 lg:px-0 px-5 shadow-lg">
          <TableOfContents value={body} />
        </div>
        <div className="w-full max-w-screen-md px-5 pb-10 mx-auto sm:pt-10 lg:px-0 sm:pb-24">
          <article className="pt-8 prose-a:decoration-indigo-500 hover:prose-a:decoration-indigo-300 prose-a:transition prose prose-lg prose-h2:py-8 md:prose-xl lg:prose-h2:text-5xl lg:prose-h3:text-4xl prose-headings:font-bold md:prose-code:text-sm lg:prose-code:text-[80%] md:prose-code:text-[80%] prose-code:text-[70%] max-w-none break-words">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
          <Signature />
        </div>
        {!loadingSubscriber && (
          <>{subscriber ? <Share title={title} /> : <SubscribeForm />}</>
        )}
        <RelatedResources resources={related} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
  const message = `${title} por @TODO`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

const RelatedResources: React.FC<{resources: SanityDocument[]}> = ({
  resources,
}) => {
  return !isEmpty(resources) ? (
    <section className="w-full px-5 pb-16 mx-auto sm:pt-14 sm:pb-32">
      <div className="flex flex-col items-start justify-between w-full max-w-screen-md mx-auto sm:flex-row">
        <div className="flex-shrink-0 pt-2 pb-4 font-medium uppercase sm:text-lg text-slate-400 sm:pr-32 sm:pb-0">
          Continue Reading
        </div>
        <div className="flex-grow">
          {resources.map(({title, subtitle, slug}) => {
            return (
              <div className="">
                <Link href={`/${slug}`}>
                  <a className="text-2xl font-semibold transition lg:text-3xl hover:underline">
                    {title}
                  </a>
                </Link>
                {subtitle && (
                  <p className="pt-2 text-lg lg:text-xl text-slate-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  ) : null
}

const Header: React.FC<SanityDocument> = ({
  title,
  subtitle,
  date,
  estimatedReadingTime,
}) => {
  return (
    <header className="relative flex flex-col items-center px-5 pt-24 pb-8 overflow-hidden border-gray-200">
      <div className="relative z-10 flex flex-col items-center w-full max-w-screen-lg mx-auto">
        <Link passHref href="/articulos">
          <a className="relative px-4 py-2 text-base font-normal transition bg-black/10 hover:bg-slate-300 rounded-lg sm:text-lg group opacity-80">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            Todos los Artículos
          </a>
        </Link>
        <div className="flex flex-col items-center justify-center pt-10 pb-24 text-center">
          <h1 className="py-4 mx-auto text-4xl font-bold leading-none font-heading sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-center w-full max-w-screen-md gap-10 text-lg leading-none sm:justify-between">
          <Author />
          <div className="flex space-x-5 items-center">
            <time dateTime={date} className="text-sm flex items-center">
              <ClockIcon aria-hidden="true" className="w-4 opacity-80" />
              <span className="pl-1">
                <span>~</span>
                {estimatedReadingTime}m
              </span>
            </time>
            <Share title={title} />
          </div>
        </div>
      </div>
    </header>
  )
}

const Author = () => {
  return (
    <div className="flex items-center justify-center col-span-3 md:justify-start md:col-span-3">
      <a
        href="https://twitter.com/escuelafrontend"
        className="leading-none hover:underline decoration-indigo-500 underline-offset-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        Escuela Frontend
      </a>
    </div>
  )
}

const Signature = () => {
  return <></>
}
