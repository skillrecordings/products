import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import {GetStaticProps} from 'next'
import {Article, getAllArticles} from '../lib/articles'
import {toPlainText} from '@portabletext/react'

const meta = {
  title: 'Articles',
  description:
    '  In-depth article to learn how to navigate the frontend ecosystem.',
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout
      meta={meta}
      className="sm:pt-18 flex flex-col items-center pb-16 pt-16 lg:pt-20 lg:pb-24"
    >
      <header className="relative z-10 flex flex-col items-center px-5 pb-16 text-center">
        <h1 className="text-center font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          {meta.title}
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-gray-200">
          {meta.description}
        </p>
      </header>
      <main className="flex-grow px-5">
        <div className="mx-auto w-full max-w-screen-lg pb-16">
          <div className="grid grid-cols-1 gap-5 sm:gap-10 md:grid-cols-2">
            {isEmpty(articles) ? (
              <h3>Sorry, there are no articles yet</h3>
            ) : (
              articles.map(
                ({
                  title,
                  slug,
                  description,
                  date,
                  body,
                  subtitle,
                  estimatedReadingTime,
                }) => {
                  const shortDescription =
                    description || toPlainText(body).substring(0, 190) + '...'
                  return (
                    <div
                      key={slug}
                      className="gap-5 rounded-md bg-gray-800 p-8 shadow-xl shadow-black/10 sm:p-10"
                    >
                      <div className="justify-left flex w-full sm:justify-between">
                        <div>
                          <h2 className="font-heading text-2xl font-bold transition lg:text-3xl">
                            <Link href={`/${slug}`} passHref>
                              <a className="group block">{title}</a>
                            </Link>
                          </h2>
                          <h3 className="pt-3 text-xl font-medium text-gray-300">
                            {subtitle}
                          </h3>
                          <p className="pt-5 font-normal text-gray-300">
                            {shortDescription}
                          </p>
                          {/* <time
                            dateTime={date}
                            className="block pt-1 font-semibold pb-5 text-gray-500"
                          >
                            {format(new Date(date), 'dd MMMM, y')}
                          </time> */}
                          {/* {description && (
                            <Markdown className="prose pt-3 pb-6">
                              {description}
                            </Markdown>
                          )} */}
                          <div className="mt-6 flex w-full items-center justify-between space-x-5">
                            <Link href={`/${slug}`} passHref>
                              <a className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand/70">
                                View article{' '}
                                <span
                                  aria-hidden="true"
                                  className="text-white/90 transition group-hover:text-white"
                                >
                                  →
                                </span>
                              </a>
                            </Link>
                            <div className="text-sm text-gray-400">
                              Time to read: ~{estimatedReadingTime}m
                            </div>
                          </div>
                        </div>
                      </div>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

export default Articles
