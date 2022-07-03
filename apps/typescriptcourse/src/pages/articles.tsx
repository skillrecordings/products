import * as React from 'react'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'

const meta = {
  title: 'TypeScript Articles',
  ogImage: {
    url: 'https://testingaccessibility.com/assets/accessibility-articles-card@2x.png',
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <div>
      <header className="relative px-5 overflow-hidden text-white bg-blue-700 py-28 bg-noise">
        <h1 className="max-w-screen-md mx-auto text-3xl font-bold leading-none text-center font-heading sm:text-4xl lg:text-5xl">
          TypeScript Articles
        </h1>
      </header>
      <main className="flex-grow px-5">
        <div className="w-full max-w-lg gap-16 pt-16 pb-16 mx-auto">
          <div className="grid grid-cols-1 gap-16">
            {articles.map(
              ({title, slug, description, date}: SanityDocument) => {
                return (
                  <div key={slug} className="gap-5">
                    <div className="flex w-full sm:justify-between justify-left">
                      <div>
                        <Link href={`/${slug}`} passHref>
                          <a className="block group">
                            <h2 className="text-xl font-bold text-blue-600 group-hover:underline sm:text-3xl font-heading">
                              {title}
                            </h2>
                          </a>
                        </Link>
                        <time
                          dateTime={date}
                          className="block pt-1 pb-5 font-semibold"
                        >
                          {format(new Date(date), 'dd MMMM, y')}
                        </time>
                        {description && (
                          <Markdown className="pt-3 pb-6 prose">
                            {description}
                          </Markdown>
                        )}
                      </div>
                    </div>
                    {slug && (
                      <Link href={`/${slug}`} passHref>
                        <a
                          className="inline-flex px-3 py-2 font-semibold text-blue-600 transition rounded-md font-nav hover:bg-moss-200/50 bg-moss-100"
                          aria-label={`Read ${title}`}
                        >
                          Read
                          <i aria-hidden className="pl-2">
                            →
                          </i>
                        </a>
                      </Link>
                    )}
                  </div>
                )
              },
            )}
          </div>
        </div>
      </main>
    </div>
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
