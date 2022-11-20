import React from 'react'
import TableOfContents from 'components/portable-text/table-of-contents'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import Share from 'components/share'
import isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import {PortableText, toPlainText} from '@portabletext/react'
import {useConvertkit} from '@skillrecordings/convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import SubscribeForm from 'components/subscribe-form'
import {getOgImage} from 'utils/get-og-image'
import {isBrowser} from 'utils/is-browser'
import {type Article} from 'lib/articles'
import {format} from 'date-fns'
import Image from 'next/image'

type ArticleTemplateProps = {
  article: Article
  hasSubscribed: boolean
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({article}) => {
  const {title, metaTitle, description, body, date} = article
  const shortDescription =
    description || toPlainText(body).substring(0, 150) + '...'
  const ogImage = getOgImage({title})
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title: metaTitle || title,
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
      <ArticleMeta article={article} shortDescription={shortDescription} />
      <Header {...article} />
      <main>
        <div className="border-y border-gray-600 bg-gray-800/40 px-5 shadow-lg shadow-black/5 lg:px-0">
          <TableOfContents value={body} />
        </div>
        <div className="mx-auto w-full max-w-screen-md px-5 pb-10 sm:pt-10 sm:pb-24 lg:px-0">
          <article className="prose prose-invert max-w-none pt-8 prose-headings:font-bold  prose-a:text-brand prose-a:transition prose-code:text-[70%] sm:prose-lg md:prose-code:text-sm md:prose-code:text-[80%] lg:prose-code:text-[80%]">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
        </div>
        {!loadingSubscriber && (
          <>{subscriber ? <Share title={title} /> : <SubscribeForm />}</>
        )}
        <RelatedResources article={article} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const RelatedResources: React.FC<{
  article: Article
}> = ({article}) => {
  const resources = article.related

  return !isEmpty(resources) ? (
    <section className="mx-auto w-full px-5 pb-16 sm:pt-14 sm:pb-32">
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-start justify-between sm:flex-row">
        <div className="flex-shrink-0 pt-2 pb-4 font-semibold uppercase text-gray-600 sm:pr-32 sm:pb-0">
          Continue Reading
        </div>
        <div className="flex-grow">
          {resources.map(({title, subtitle, slug}) => {
            return (
              <div key={title}>
                <Link href={`/${slug}`}>
                  <a className="font-heading text-2xl font-bold transition hover:underline lg:text-3xl">
                    {title}
                  </a>
                </Link>
                {subtitle && (
                  <p className="max-w-sm pt-2 text-lg text-brand lg:text-xl">
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

const Header: React.FC<Article> = ({
  title,
  subtitle,
  date,
  estimatedReadingTime,
  author,
}) => {
  return (
    <header className="relative flex flex-col items-center overflow-hidden px-5 pb-8 sm:pt-10">
      <div className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center">
        {/* <Link passHref href="/articles">
          <a className="sm:text-lg text-base group text-white relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-10 bg-opacity-0 bg-gray-900 rounded-lg transition opacity-80 hover:opacity-80 focus-visible:ring-white focus-visible:opacity-100">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link> */}
        <div className="flex flex-col items-center justify-center pt-10 pb-24 text-center">
          <h1 className="mx-auto py-4 font-heading text-3xl font-bold leading-none text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <h2 className="mx-auto max-w-md pt-5 text-lg font-medium leading-tight text-brand sm:text-xl">
              {subtitle}
            </h2>
          )}
        </div>
        <div className="flex w-full max-w-screen-md flex-wrap items-center justify-center gap-10 leading-none sm:justify-between sm:text-lg">
          {!isEmpty(author) ? (
            <>
              <div className="col-span-3 flex items-center justify-center md:col-span-3 md:justify-start">
                <Image
                  src={author.image}
                  alt="Author"
                  width={42}
                  height={42}
                  priority
                  loading="eager"
                  className="rounded-full"
                />
                <a
                  href={author.twitter}
                  className="pl-2 text-sm decoration-brand underline-offset-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {author.name}
                </a>
              </div>
            </>
          ) : null}
          <div className="flex gap-16 sm:text-left">
            <div>
              <div className="pb-1.5 text-sm font-semibold uppercase tracking-wide text-gray-300">
                Time to read
              </div>
              <div>
                <span className="text-gray-500">~</span>
                {estimatedReadingTime}m
              </div>
            </div>
            <time dateTime={date}>
              <div className="pb-1.5 text-sm font-semibold uppercase tracking-wide text-gray-300">
                published
              </div>
              <div>{format(new Date(date), 'dd MMMM, y')}</div>
            </time>
          </div>
        </div>
      </div>
    </header>
  )
}

const ArticleMeta: React.FC<{article: Article; shortDescription: string}> = ({
  article,
  shortDescription,
}) => {
  const {title, date} = article
  return (
    <ArticleJsonLd
      title={title}
      description={shortDescription}
      datePublished={date}
      url={isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL}
      authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
      images={['']}
    />
  )
}
