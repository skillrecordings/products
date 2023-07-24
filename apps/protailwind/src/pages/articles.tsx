import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import {GetStaticProps} from 'next'
import {Article, getAllArticles} from '../lib/articles'
import PageHeadline from 'components/page-headline'
import readingTime from 'reading-time'
import {format} from 'date-fns'

const meta = {
  title: 'Tailwind Articles',
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <header className="relative overflow-hidden px-5 pb-10 pt-16 sm:pb-20 sm:pt-20">
        <PageHeadline>{meta.title}</PageHeadline>
      </header>
      <main className="flex-grow px-5">
        <div className="mx-auto w-full max-w-screen-lg pb-16">
          <div className="grid grid-cols-1 gap-5 sm:gap-10 md:grid-cols-2">
            {isEmpty(articles) ? (
              <h3>Sorry, there are no articles yet</h3>
            ) : (
              articles.map(({title, slug, summary, body, subtitle, date}) => {
                const estimatedReadingTime = readingTime(body)

                return (
                  <div
                    key={slug}
                    className="gap-5 rounded-xl bg-white p-8 shadow-xl shadow-black/5 sm:p-10"
                  >
                    <div className="justify-left flex w-full sm:justify-between">
                      <div>
                        <h2 className="font-heading text-2xl font-black transition lg:text-3xl">
                          <Link
                            href={`/${slug}`}
                            passHref
                            className="group block"
                          >
                            {title}
                          </Link>
                        </h2>
                        <time
                          dateTime={date}
                          className="mt-4 block font-semibold text-gray-500"
                        >
                          Posted on {format(new Date(date), 'do MMMM, y')}
                        </time>
                        <h3 className="pt-3 text-xl font-medium text-gray-700">
                          {subtitle}
                        </h3>
                        <div className="mt-6 flex w-full items-center justify-between space-x-5">
                          <Link
                            href={`/${slug}`}
                            passHref
                            className="group my-4 inline-block gap-2 rounded-full bg-brand-red px-4 py-2 font-medium text-white transition hover:brightness-110"
                          >
                            Read article{' '}
                            <span
                              aria-hidden="true"
                              className="text-white/90 transition group-hover:text-white"
                            >
                              →
                            </span>
                          </Link>
                          <div className="text-sm text-gray-700">
                            Time to read: ~
                            {estimatedReadingTime.minutes.toFixed(0)}m
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

export default Articles
