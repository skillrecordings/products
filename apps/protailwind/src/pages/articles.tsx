import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'
import {DividerStar} from 'pages'

const meta = {
  title: 'Pro Tailwind Articles',
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden" nav>
      <header className="relative px-5 py-28 sm:pt-40 overflow-hidden text-white">
        <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-4xl sm:text-5xl lg:text-6xl">
          {meta.title}
        </h1>
        <DividerStar />
      </header>
      <main className="px-5 flex-grow">
        <div className="pb-16 mx-auto max-w-screen-sm w-full">
          <div className="grid grid-cols-1 divide-y divide-gray-800">
            {isEmpty(articles) ? (
              <h3>Sorry, there are no articles yet</h3>
            ) : (
              articles.map(
                ({title, slug, description, date}: SanityDocument) => {
                  return (
                    <div key={slug} className="gap-5 py-8">
                      <div className="flex w-full sm:justify-between justify-left">
                        <div>
                          <Link href={`/${slug}`} passHref>
                            <a className="group block">
                              <h2 className="group-hover:underline lg:text-4xl sm:text-xl text-2xl font-heading font-semibold">
                                {title}
                              </h2>
                            </a>
                          </Link>
                          <time
                            dateTime={date}
                            className="block pt-1 font-semibold pb-5 text-gray-500"
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
                      {/* {slug && (
                        <Link href={`/${slug}`} passHref>
                          <a
                            className="text-lg hover:underline transition bg-moss-100 text-amber-300 font-semibold inline-flex"
                            aria-label={`Read ${title}`}
                          >
                            Read
                          </a>
                        </Link>
                      )} */}
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
