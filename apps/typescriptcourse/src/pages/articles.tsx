import * as React from 'react'
import Link from 'next/link'
import {GetServerSideProps} from 'next'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'
import Layout from 'components/app/layout'
const meta = {
  title: 'TypeScript Articles',
  ogImage: {
    url: 'https://typescriptcourse.com/images/share/card-articles@2x.png',
    width: 1200,
    height: 640,
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<React.PropsWithChildren<ArticlesProps>> = ({
  articles,
}) => {
  return (
    <Layout meta={meta} className="relative">
      <header className="relative px-5 overflow-hidden text-white py-28">
        <h1 className="max-w-screen-md mx-auto text-3xl font-bold leading-none text-center font-heading sm:text-4xl lg:text-5xl">
          Written Resources for Navigating the
          <span className="text-transparent bg-gradient-to-l from-purple-100 to-blue-400 bg-clip-text decoration-clone">
            {' '}
            TypeScript
          </span>{' '}
          Ecosystem
        </h1>
      </header>
      <main className="flex-grow px-5 mb-20">
        <div className="w-full max-w-xl gap-16 pt-16 pb-16 mx-auto">
          <div className="grid grid-cols-1 gap-16">
            {articles.map(({title, slug}: SanityDocument) => {
              return (
                <div key={slug} className="gap-5">
                  <div className="flex w-full sm:justify-between justify-left">
                    <div>
                      <Link href={`/${slug}`} passHref>
                        <a className="block group">
                          <h2 className="mb-10 text-xl font-bold text-white sm:text-3xl font-heading">
                            {title}
                          </h2>
                        </a>
                      </Link>
                    </div>
                  </div>
                  {slug && (
                    <Link href={`/${slug}`} passHref>
                      <a
                        className="relative px-4 py-3 text-sm font-normal text-white transition bg-white bg-opacity-0 rounded-full bg-opacity-10 sm:text-base group hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100"
                        aria-label={`Read ${title}`}
                      >
                        Read Article
                        <i aria-hidden className="pl-2">
                          →
                        </i>
                      </a>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const articles = await getAllArticles()

  return {
    props: {articles},
  }
}

export default Articles
