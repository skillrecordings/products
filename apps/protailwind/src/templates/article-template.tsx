import React from 'react'
import TableOfContents from 'components/portable-text/table-of-contents'
import PortableTextComponents from 'components/portable-text'
import SubscribeForm from 'components/subscribe-form'
import Layout from 'components/layout'
import Share from 'components/share'
import Image from 'next/image'
import Link from 'next/link'
import {PortableText, toPlainText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {getOgImage} from 'utils/get-og-image'
import {format} from 'date-fns'

type ArticleTemplateProps = {
  article: SanityDocument
  hasSubscribed: boolean
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({article}) => {
  const {title, description, body, date} = article
  const shortDescription =
    description || toPlainText(body).substring(0, 157) + '...'
  const ogImage = getOgImage(title)

  return (
    <Layout
      className="overflow-hidden"
      nav
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
        <div className="max-w-screen-sm mx-auto w-full md:pt-16 pt-10 lg:px-0 px-5 pb-16">
          <TableOfContents value={body} />
          <article className="pt-8 prose md:prose-lg lg:prose-xl prose-headings:font-bold md:prose-code:text-sm lg:prose-code:text-[80%] md:prose-code:text-[80%] prose-code:text-[70%] max-w-none">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
        </div>
        <SubscribeForm />
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const Header: React.FC<SanityDocument> = ({
  title,
  subtitle,
  date,
  estimatedReadingTime,
}) => {
  return (
    <header className="flex flex-col items-center relative px-5 pt-24 pb-8 overflow-hidden text-white">
      <div className="flex flex-col items-center max-w-screen-lg mx-auto w-full relative z-10">
        <Link passHref href="/articles">
          <a className="sm:text-base text-sm group text-white relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-10 bg-opacity-0 bg-white rounded-full transition opacity-80 hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link>
        <div className="pt-10 pb-24 flex flex-col items-center justify-center text-center">
          <h1 className="font-heading font-bold mx-auto leading-none text-3xl sm:text-4xl lg:text-6xl py-4">
            {title}
          </h1>
          {subtitle && (
            <h2 className="pt-2 text-2xl text-indigo-400 brightness-125 max-w-xl mx-auto">
              {subtitle}
            </h2>
          )}
        </div>
        <div className="font-medium text-lg px-5 w-full flex md:flex-row flex-col md:space-y-0 space-y-3 items-start justify-center space-x-10 max-w-screen-lg leading-none">
          <Author />
          <div>
            <div className="text-sm uppercase font-semibold text-slate-400 pb-1.5">
              Time to read
            </div>
            <div>
              <span className="text-slate-400">~</span>
              {estimatedReadingTime}m
            </div>
          </div>
          <time dateTime={date}>
            {/* <CalendarIcon aria-hidden="true" className="w-5 opacity-80" />{' '} */}
            <div className="text-sm uppercase font-semibold text-slate-400 pb-1.5">
              published
            </div>
            <div>{format(new Date(date), 'dd MMMM, y')}</div>
          </time>
          <div>
            <div className="text-sm uppercase font-semibold text-slate-400">
              Share
            </div>
            <Share title={title} />
          </div>
        </div>
      </div>
    </header>
  )
}

const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={require('../../public/assets/simon-vrachliotis.png')}
        alt="Simon Vrachliotis"
        width={56}
        height={56}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 leading-none">Simon Vrachliotis</span>
    </div>
  )
}
