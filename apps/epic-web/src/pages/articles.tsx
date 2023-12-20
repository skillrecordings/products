import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import Balancer from 'react-wrap-balancer'
import {getAllArticles, type Article} from 'lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import readingTime from 'reading-time'
import ResourceAuthor from 'components/resource-author'

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
        <h1 className="text-lg font-semibold">
          {title} <span className="font-normal">by Kent C. Dodds</span>
        </h1>
      </header>
      <main className="mx-auto grid w-full max-w-screen-lg grid-cols-1 flex-col gap-5 px-5 pb-24 sm:grid-cols-2 lg:gap-10">
        {publishedArticles.map((article) => {
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
                {image?.secure_url && (
                  <div className="relative aspect-video h-full">
                    <Image
                      src={image.secure_url}
                      className="object-cover"
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 768px) 418px, (max-width: 1200px) 418px, 280px"
                    />
                  </div>
                )}
                <div className="flex h-full flex-col justify-between rounded-b-lg border-x border-b border-transparent px-5 py-8 dark:border-gray-900 md:px-8">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {description && (
                      <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                    <div className="flex w-full items-center gap-10 text-sm text-gray-700 dark:text-gray-300">
                      <ResourceAuthor
                        as="div"
                        name={author?.name}
                        slug={author?.slug}
                        image={author?.image}
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
      </main>
    </Layout>
  )
}

export default Articles
