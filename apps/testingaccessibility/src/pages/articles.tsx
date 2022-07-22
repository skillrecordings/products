import * as React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'

const meta = {
  title: 'Accessibility Articles',
  ogImage: {
    url: 'https://testingaccessibility.com/assets/accessibility-articles-card@2x.png',
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta}>
      <main>
        <header className="relative px-5 py-28 overflow-hidden text-white bg-green-700 bg-noise">
          <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
            Accessibility Articles
          </h1>
        </header>
        <div className="px-5 flex-grow">
          <div className="lg:py-16 py-10 mx-auto max-w-screen-lg w-full gap-16">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
              {articles.map(
                ({title, slug, description, date}: SanityDocument) => {
                  return (
                    <div key={slug} className="gap-5">
                      <div className="flex w-full sm:justify-between justify-left">
                        <div>
                          <Link href={`/${slug}`} passHref>
                            <a className="group block">
                              <h2 className="text-green-600 group-hover:underline sm:text-3xl font-heading text-2xl font-bold">
                                {title}
                              </h2>
                            </a>
                          </Link>
                          <time
                            dateTime={date}
                            className="block pt-3 text-sm font-medium opacity-80 pb-5"
                          >
                            {format(new Date(date), 'MMMM dd, y')}
                          </time>
                          {description && (
                            <Markdown className="prose pt-3 pb-6">
                              {description}
                            </Markdown>
                          )}
                        </div>
                      </div>
                      {slug && (
                        <Link href={`/${slug}`} passHref>
                          <a
                            className="font-nav px-3 py-2 pt-1.5 rounded-md hover:bg-moss-200/50 transition bg-moss-100 text-green-600 font-semibold inline-flex"
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
