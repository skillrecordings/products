import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import {getAllArticles, type Article} from 'lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import readingTime from 'reading-time'
import ResourceContributor from 'components/resource-contributor'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

const Articles: React.FC<{articles: Article[]}> = ({articles}) => {
  const title = 'Epic Web Dev Articles'
  const pageDescription = 'Articles about Web Development'
  const publishedArticles =
    process.env.NODE_ENV === 'development'
      ? articles
      : articles.filter(({state}) => state === 'published')
  const latestArticle = publishedArticles[0]
  const restArticles = publishedArticles.slice(1)

  const {subscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1665414992/epicweb.dev/blog/card_2x.png',
          alt: title,
        },
      }}
    >
      <header className="mx-auto w-full max-w-screen-lg px-5 pb-3 pt-5 sm:pb-5 sm:pt-8">
        <h1 className="text-lg font-light">{title}</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg">
        {latestArticle && (
          <article className="mb-5 px-5">
            <Link
              href={latestArticle.slug}
              passHref
              onClick={() => {
                track('clicked start reading article', {
                  article: latestArticle.slug,
                })
              }}
              className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-gradient-to-tr from-primary to-indigo-500 text-white shadow-2xl shadow-gray-500/20 transition hover:bg-gray-50 dark:shadow-none dark:hover:bg-gray-900/40 md:aspect-[16/6]"
            >
              <div className="flex h-full flex-col justify-between rounded-lg border border-transparent px-5 py-8 dark:border-gray-900 md:px-8">
                <div className="relative z-10">
                  <h2 className="text-balance text-2xl font-bold sm:text-3xl">
                    {latestArticle.title}
                  </h2>
                  {latestArticle.description && (
                    <p className="line-clamp-3 w-full pt-3 opacity-80">
                      {latestArticle.description}
                    </p>
                  )}
                </div>
                <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                  <div className="flex w-full items-center gap-10 text-sm">
                    <ResourceContributor
                      as="div"
                      name={latestArticle.author?.name}
                      slug={latestArticle.author?.slug}
                      image={latestArticle.author?.picture?.url}
                      byline="Written by"
                      className="text-sm font-normal text-white [&_span]:font-bold"
                    />
                    <div>
                      <div className="block font-bold">Time to read</div>~{' '}
                      {readingTime(latestArticle.body).minutes.toFixed(0)}{' '}
                      minutes
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )}
        <div className="grid w-full grid-cols-1 flex-col gap-5 px-5 pb-10 sm:grid-cols-2 lg:gap-5">
          {restArticles.map((article) => {
            const {title, image, slug, description, body, author} = article
            const estimatedReadingTime = readingTime(body)
            return (
              <article key={slug}>
                <Link
                  href={slug}
                  passHref
                  onClick={() => {
                    track('clicked start reading article', {
                      article: slug,
                    })
                  }}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl shadow-gray-500/20 transition hover:bg-gray-50 dark:bg-background dark:shadow-none dark:hover:bg-gray-900/40"
                >
                  <div className="flex h-full flex-col justify-between rounded-lg border border-transparent px-5 py-8 dark:border-gray-900 md:px-8">
                    <div className="relative z-10">
                      <h2 className="text-balance text-2xl font-bold">
                        {title}
                      </h2>
                      {description && (
                        <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      )}
                    </div>
                    <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                      <div className="flex w-full items-center gap-10 text-sm text-gray-700 dark:text-gray-300">
                        <ResourceContributor
                          as="div"
                          name={author?.name}
                          slug={author?.slug}
                          image={author?.picture?.url}
                          byline="Written by"
                          className="text-sm font-normal text-gray-700 dark:text-gray-300 [&_span]:font-bold"
                        />
                        <div>
                          <div className="block font-bold">Time to read</div>~{' '}
                          {estimatedReadingTime.minutes.toFixed(0)} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </main>
      <div>{!subscriber && <PrimaryNewsletterCta className="mt-32" />}</div>
    </Layout>
  )
}

export default Articles
