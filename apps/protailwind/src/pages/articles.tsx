import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetStaticProps} from 'next'
import {Article, getAllArticles} from '../lib/articles'
import {toPlainText} from '@portabletext/react'

const meta = {
  title: 'Tailwind Articles',
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <header className="relative overflow-hidden px-5 pt-16 pb-10 sm:pb-20 sm:pt-24">
        <h1 className="mx-auto max-w-screen-md text-center font-heading text-3xl font-black leading-none sm:text-4xl lg:text-5xl">
          {meta.title}
        </h1>
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
                          <h3 className="pt-3 text-xl font-medium text-gray-700">
                            {subtitle}
                          </h3>
                          <p className="pt-5 font-normal text-gray-600">
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
                            <Link
                              href={`/${slug}`}
                              passHref
                              className="rounded-full bg-sky-500 px-5 py-3 text-white transition hover:bg-sky-600"
                            >
                              View article
                            </Link>
                            <div className="text-sm text-gray-700">
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
