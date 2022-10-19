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
  title: 'Artículos de Ingeniería Front-End',
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <header className="relative px-5 pb-10 overflow-hidden pt-28 sm:pb-16 sm:pt-40">
        <h1 className="max-w-screen-md text-center font-heading text-5xl font-bold sm:text-5xl m-auto">
          {meta.title}
        </h1>
      </header>
      <main className="flex-grow">
        <div className="w-full max-w-screen-lg pb-16 mx-auto">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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
                          <h2 className="text-2xl font-semibold underline transition decoration-white hover:decoration-slate-500 lg:text-3xl sm:text-xl font-heading">
                            <Link href={`/${slug}`} passHref>
                              <a className="block group">{title}</a>
                            </Link>
                          </h2>
                          {description && (
                            <Markdown className="pt-3 pb-6 prose">
                              {description}
                            </Markdown>
                          )}
                          <div className="flex items-center w-full mt-6 space-x-5">
                            <Link href={`/${slug}`} passHref>
                              <a className="inline-flex px-4 py-2 text-lg font-medium transition rounded-lg bg-black/10 hover:bg-slate-300">
                                Leer Artículo
                                <i aria-hidden className="pl-2">
                                  →
                                </i>
                              </a>
                            </Link>
                            <div className="">
                              Tiempo Estimado: {estimatedReadingTime}m
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
