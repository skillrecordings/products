import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import {getAllArticles, type Article} from 'lib/articles'
import Link from 'next/link'
import Image from 'next/legacy/image'
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
  const pageDescription = 'Articles about Epic Web Dev'
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
      <header className="w-full text-center sm:pt-28 py-20 sm:pb-24 pb-20 bg-gradient-to-b from-black/40 to-gray-900">
        <h1 className="fluid-3xl font-bold">{title}</h1>
      </header>
      <main className="max-w-2xl mx-auto w-full flex flex-col gap-10 pb-24">
        {publishedArticles.map((article) => {
          const {title, image, slug, description, estimatedReadingTime} =
            article
          return (
            <article
              key={slug}
              className="md:px-12 md:py-12 px-6 py-10 sm:rounded-lg bg-gray-800/40 relative overflow-hidden md:aspect-video flex flex-col justify-between border border-white/5"
            >
              {image?.secure_url && (
                <Image
                  src={image.secure_url}
                  aria-hidden="true"
                  alt=""
                  layout="fill"
                  className="opacity-25 brightness-150 blur-sm pointer-events-none select-none object-cover"
                />
              )}
              <div className="relative z-10">
                <h2 className="fluid-2xl font-semibold">
                  <Link
                    href={slug}
                    passHref
                    onClick={() => {
                      track('clicked article title', {
                        article: slug,
                      })
                    }}
                    className="hover:underline"
                  >
                    {title}
                  </Link>
                </h2>
                {description && (
                  <p className="text-gray-200 opacity-75 pt-3 max-w-lg">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex md:flex-row flex-col md:space-y-0 space-y-10 w-full md:items-center items-start justify-between relative z-10 pt-8">
                <div className="flex items-center gap-8 text-gray-300 md:text-base text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-black/40 rounded-full overflow-hidden">
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
                <Link
                  href={slug}
                  passHref
                  onClick={() => {
                    track('clicked start reading article', {
                      article: slug,
                    })
                  }}
                  className="hover:bg-yellow-300 transition-all px-4 py-3 rounded bg-brand text-black font-bold"
                >
                  Start reading<span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          )
        })}
      </main>
    </Layout>
  )
}

export default Articles
