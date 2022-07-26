import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'

const meta = {
  title: 'Protailwind Articles',
  ogImage: {
    url: `${process.env.NEXT_PUBLIC_URL}/accessibility-articles-card@2x.png`,
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  console.log('articles:', articles)
  return (
    <Layout meta={meta} className="overflow-hidden" nav>
      <header className="relative px-5 py-28 overflow-hidden text-white">
        <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Protailwind Articles
        </h1>
      </header>
      <main className="px-5 flex-grow">
        <div className="pb-16 mx-auto max-w-lg w-full pt-16 gap-16">
          <div className="grid grid-cols-1 gap-16">
            {isEmpty(articles) ? (
              <h3>Sorry, there are no articles yet</h3>
            ) : (
              articles.map(
                ({title, slug, description, date}: SanityDocument) => {
                  return (
                    <div key={slug} className="gap-5">
                      <div className="flex w-full sm:justify-between justify-left">
                        <div>
                          <Link href={`/${slug}`} passHref>
                            <a className="group block">
                              <h2 className="group-hover:underline sm:text-3xl font-heading text-xl font-bold">
                                {title}
                              </h2>
                            </a>
                          </Link>
                          <time
                            dateTime={date}
                            className="block pt-1 font-semibold pb-5 text-indigo-300"
                          >
                            {format(new Date(date), 'dd MMMM, y')}
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
                            className="font-nav px-3 py-2 rounded-md hover:bg-amber-100/20 transition bg-moss-100 text-amber-300 font-semibold inline-flex"
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
              )
            )}
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
