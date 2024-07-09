import * as React from 'react'
import Link from 'next/link'
import {type ArticlePageProps} from '../pages/[article]'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {getIsoDate} from '@/utils/get-iso-date'
import config from '@/config'
import {type Article} from '@/lib/articles'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import ShareCta from '@/components/share-cta'
import SubscribeToReactEmailCourseCta from '@/components/subscribe-react-email-course-cta'
import {truncate} from 'lodash'
import {MDXRemote, type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import ResourceContributor from '@/components/resource-contributor'
import {ChevronLeftIcon} from '@heroicons/react/outline'
import {ArticleTeaser} from '@/pages/articles'
import ReactAndStaleClosuresDemo from '@/components/mdx-components/how-react-uses-closures-to-avoid-bugs'

const MoreArticles: React.FC<{articles: Article[]}> = ({articles}) => {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-gray-50 py-10 dark:bg-gray-950/50 sm:py-24">
      <div className="w-full max-w-screen-lg px-5">
        <h2 className="mb-8 text-sm uppercase text-er-gray-700 opacity-75">
          More Articles
        </h2>
        <ul className="grid gap-5 leading-relaxed md:grid-cols-2">
          {articles.map((article) => (
            <li className="flex w-full" key={article._id}>
              <ArticleTeaser article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const ArticleTemplate: React.FC<ArticlePageProps> = ({
  article,
  articleBodySerialized,
  articles,
  estimatedReadingTime,
}) => {
  const {title, slug, image, summary, ogImage} = article
  const date = article.date || article._createdAt
  const pageDescription = summary || ''
  const author = config.author
  const url = `${process.env.NEXT_PUBLIC_URL}/${slug}`
  const {subscriber, loadingSubscriber} = useConvertkit()
  const allButCurrentArticles = articles.filter(
    (article) => article.slug !== slug,
  )

  return (
    <Layout
      meta={{
        title: truncate(title, {length: 75}),
        description: truncate(pageDescription, {length: 155}),
        url,
        ogImage: {
          url: ogImage?.secure_url
            ? ogImage.secure_url
            : `${process.env.NEXT_PUBLIC_URL}/api/og/article?title=${encodeURI(
                title,
              )}`,
          alt: title,
        },
      }}
    >
      <ArticleJsonLd
        title={title}
        images={[]}
        authorName={author}
        datePublished={date}
        dateModified={date}
        description={pageDescription}
        url={url}
      />
      <main className="mx-auto flex w-full flex-col items-center px-5 py-10 sm:py-16">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-1 text-center text-sm opacity-50 transition hover:opacity-75"
        >
          <ChevronLeftIcon className="h-3 w-3 transition" /> Articles
        </Link>
        <h1 className="mx-auto mb-8 w-full max-w-screen-lg text-balance px-5 text-center text-4xl font-bold leading-tight sm:px-0 sm:text-5xl">
          {title}
        </h1>
        <ResourceContributor as="div" className="mx-auto" />
        {/* <Divider /> */}
        <div className="prose mt-8 w-full max-w-4xl pb-24 md:prose-lg lg:prose-xl sm:pb-32 md:mt-16 md:px-8 lg:mt-16">
          <MDX
            contents={articleBodySerialized}
            components={{
              ReactAndStaleClosuresDemo,
            }}
          />
          {/* {children} */}
        </div>
        <Divider />
        {subscriber ? (
          <ShareCta className="mb-0 py-16" title={title} slug={slug} />
        ) : (
          <div className="py-16">
            <SubscribeToReactEmailCourseCta>
              <h2 className="mb-2 text-center text-2xl font-bold leading-tight sm:text-3xl">
                Get my free 7-part email course on React!
              </h2>
              <p className="mb-10 text-center text-base leading-tight text-react">
                Delivered straight to your inbox.
              </p>
            </SubscribeToReactEmailCourseCta>
          </div>
        )}
      </main>
      <MoreArticles articles={articles} />
    </Layout>
  )
}

export default ArticleTemplate
