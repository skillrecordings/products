import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'
import {toPlainText} from '@portabletext/react'

const meta = {
  title: 'Pro Tailwind Articles',
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden" nav>
      <header className="relative px-5 pt-28 sm:pb-16 pb-10 sm:pt-40 overflow-hidden text-white">
        <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-4xl sm:text-5xl lg:text-6xl">
          {meta.title}
        </h1>
      </header>
      <main className="flex-grow">
        <div className="pb-16 mx-auto max-w-screen-lg w-full">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
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
                }: SanityDocument) => {
                  const shortDescription =
                    description || toPlainText(body).substring(0, 190) + '...'
                  return (
                    <div key={slug} className="gap-5 p-8">
                      <div className="flex w-full sm:justify-between justify-left">
                        <div>
                          <h2 className="underline decoration-slate-900 hover:decoration-indigo-500 transition lg:text-3xl sm:text-xl text-2xl font-heading font-semibold">
                            <Link href={`/${slug}`} passHref>
                              <a className="group block">{title}</a>
                            </Link>
                          </h2>
                          <h3 className="text-xl pt-2 font-normal text-indigo-400 brightness-110">
                            {subtitle}
                          </h3>
                          <p className="font-normal text-lg pt-4 text-slate-300">
                            {shortDescription}
                          </p>
                          {/* <time
                            dateTime={date}
                            className="block pt-1 font-semibold pb-5 text-gray-500"
                          >
                            {format(new Date(date), 'dd MMMM, y')}
                          </time> */}
                          {description && (
                            <Markdown className="prose pt-3 pb-6">
                              {description}
                            </Markdown>
                          )}
                          <div className="mt-6 flex space-x-5 items-center w-full">
                            <Link href={`/${slug}`} passHref>
                              <a className="inline-flex px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition font-medium text-lg">
                                Start reading
                              </a>
                            </Link>
                            <div className="text-slate-400 ">
                              Time to read: {estimatedReadingTime}m
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const articles = await getAllArticles()

  return {
    props: {articles},
  }
}

export default Articles
