import React from 'react'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
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
import Navigation from 'components/app/navigation'

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
      nav={<Navigation className="relative flex lg:relative" />}
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
        <div className="border-t border-b border-gray-800 bg-gray-800 px-5 shadow-lg lg:px-0">
          <TableOfContents value={body} />
        </div>
        <div className="mx-auto w-full max-w-screen-md px-5 pb-10 sm:pt-10 sm:pb-24 lg:px-0">
          <article className="prose prose-lg max-w-none break-words pt-8 prose-headings:font-bold prose-h2:py-8 prose-a:decoration-yellow-500 prose-a:transition hover:prose-a:decoration-yellow-300 prose-code:text-[70%] md:prose-xl md:prose-code:text-sm md:prose-code:text-[80%] lg:prose-h2:text-5xl lg:prose-h3:text-4xl lg:prose-code:text-[80%]">
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
    <section className="mx-auto w-full px-5 pb-16 sm:pt-14 sm:pb-32">
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-start justify-between sm:flex-row">
        <div className="flex-shrink-0 pt-2 pb-4 font-medium uppercase text-gray-400 sm:pr-32 sm:pb-0 sm:text-lg">
          Sigue leyendo
        </div>
        <div className="flex-grow">
          {resources.map(({title, subtitle, slug}) => {
            return (
              <div className="">
                <Link href={`/${slug}`}>
                  <a className="text-2xl font-semibold transition hover:underline lg:text-3xl">
                    {title}
                  </a>
                </Link>
                {subtitle && (
                  <p className="pt-2 text-lg text-gray-400 lg:text-xl">
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
    <header className="relative flex flex-col items-center overflow-hidden  px-5 pt-24 pb-8">
      <div className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center">
        <Link passHref href="/articulos">
          <a className="group relative rounded-lg bg-gray-700 px-4 py-2 text-base font-normal opacity-80 transition hover:bg-gray-600 sm:text-lg">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            Todos los Artículos
          </a>
        </Link>
        <div className="flex flex-col items-center justify-center pt-10 pb-24 text-center">
          <h1 className="font-heading mx-auto py-4 text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
        <div className="flex w-full max-w-screen-md flex-wrap items-center justify-center gap-10 text-lg leading-none sm:justify-between">
          <Author />
          <div className="flex items-center space-x-5">
            <time dateTime={date} className="flex items-center text-sm">
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
    <div className="col-span-3 flex items-center justify-center md:col-span-3 md:justify-start">
      <a
        href="https://twitter.com/escuelafrontend"
        className="leading-none decoration-yellow-500 underline-offset-1 hover:underline"
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
