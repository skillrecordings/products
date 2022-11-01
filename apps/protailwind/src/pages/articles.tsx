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
    <Layout meta={meta} className="overflow-hidden" nav>
      <header className="relative px-5 pt-40 sm:pb-16 pb-10 sm:pt-48 overflow-hidden">
        <h1 className="max-w-screen-md font-heading font-black mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          {meta.title}
        </h1>
      </header>
      <main className="flex-grow px-5">
        <div className="pb-16 mx-auto max-w-screen-lg w-full">
          <div className="grid md:grid-cols-2 grid-cols-1 sm:gap-10 gap-5">
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
                      className="gap-5 sm:p-10 p-8 rounded-xl bg-white shadow-xl shadow-black/5"
                    >
                      <div className="flex w-full sm:justify-between justify-left">
                        <div>
                          <h2 className="transition lg:text-3xl text-2xl font-heading font-black">
                            <Link href={`/${slug}`} passHref>
                              <a className="group block">{title}</a>
                            </Link>
                          </h2>
                          <h3 className="text-xl pt-3 font-medium text-gray-700">
                            {subtitle}
                          </h3>
                          <p className="font-normal pt-5 text-gray-600">
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
                          <div className="mt-6 flex space-x-5 justify-between items-center w-full">
                            <Link href={`/${slug}`} passHref>
                              <a className="rounded-full px-5 py-3 bg-sky-500 hover:bg-sky-600 transition text-white">
                                View article
                              </a>
                            </Link>
                            <div className="text-gray-700 text-sm">
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
