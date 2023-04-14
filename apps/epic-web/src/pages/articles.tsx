import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import Balancer from 'react-wrap-balancer'
import {getAllArticles, type Article} from 'lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'

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
      <header className="mx-auto w-full max-w-4xl px-5 py-16">
        <h1 className="text-lg font-medium">
          {title} <span className="font-normal">by Kent C. Dodds</span>
        </h1>
      </header>
      <main className="mx-auto grid w-full max-w-4xl grid-cols-2 flex-col gap-5 px-5 pb-24">
        {publishedArticles.map((article) => {
          const {
            title,
            image,
            imageNew,
            slug,
            description,
            estimatedReadingTime,
          } = article
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
                className="relative flex h-full w-full flex-col overflow-hidden border border-gray-200  transition hover:bg-gray-100/80 dark:border-gray-800 dark:hover:bg-gray-900/40 sm:rounded-lg"
              >
                {imageNew && (
                  <div className="relative aspect-video h-full">
                    <Image src={imageNew} alt="" fill />
                  </div>
                )}
                <div className="flex h-full flex-col justify-between px-5 py-8 md:px-8">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {description && (
                      <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                    <div className="flex items-center gap-8 text-sm text-gray-700 dark:text-gray-300 md:text-base">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                          <Image
                            src={require('../../public/kent-c-dodds.png')}
                            width={54}
                            height={54}
                            alt="Kent C. Dodds"
                          />
                        </div>
                        <div>
                          <div className="block font-bold">Written by</div>
                          <div>Kent C. Dodds</div>
                        </div>
                      </div>
                      <div>
                        <div className="block font-bold">Time to read</div>~
                        {estimatedReadingTime} minutes
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
