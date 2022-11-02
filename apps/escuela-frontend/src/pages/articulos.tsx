import * as React from 'react'
import {isEmpty} from 'lodash'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetServerSideProps} from 'next'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'
import Navigation from 'components/app/navigation'

const meta = {
  title: 'Artículos',
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout
      meta={meta}
      className="overflow-hidden"
      nav={<Navigation className="relative flex lg:relative" />}
    >
      <header className="relative overflow-hidden px-5 pt-20 pb-10 text-white md:pt-24 md:pb-16 lg:py-28">
        <h1 className="m-auto max-w-screen-md text-center font-heading text-5xl font-bold sm:text-5xl">
          {meta.title}
        </h1>
      </header>
      <main className="flex-grow">
        <div className="mx-auto w-full max-w-screen-lg pb-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {isEmpty(articles) ? (
              <h3>Sorry, there are no articles yet</h3>
            ) : (
              articles.map(
                ({
                  title,
                  slug,
                  description,
                  estimatedReadingTime,
                }: SanityDocument) => {
                  return (
                    <div key={slug} className="gap-5  p-8">
                      <div className="justify-left flex w-full sm:justify-between">
                        <div className="">
                          <div className="mb-2 text-sm text-gray-300">
                            Tiempo Estimado: {estimatedReadingTime}m
                          </div>
                          <h2 className="text-2xl font-extrabold decoration-white transition hover:decoration-gray-500 sm:text-xl lg:text-3xl">
                            <Link href={`/${slug}`} passHref>
                              <a className="group block">{title}</a>
                            </Link>
                          </h2>
                          {description && (
                            <Markdown className="prose pt-3 pb-6">
                              {description}
                            </Markdown>
                          )}
                          <div className="mt-6 flex w-full items-center space-x-5">
                            <Link href={`/${slug}`} passHref>
                              <a className="focus-visible:ring-bg-brand/70 mt-4 inline-flex items-center justify-center rounded-sm bg-brand px-4 py-4 pt-4 pb-4 text-lg font-bold text-gray-900 transition hover:bg-brand/90 hover:bg-opacity-100">
                                Leer Artículo
                                <i aria-hidden className="pl-2">
                                  →
                                </i>
                              </a>
                            </Link>
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
