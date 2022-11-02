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
  title: 'Recursos Escritos para Dominar el Ecosistema de JavaScript',
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta} className="overflow-hidden" nav>
      <header className="relative overflow-hidden px-5 pb-10 pt-28 sm:pb-16 sm:pt-40">
        <h1 className="font-heading mx-auto max-w-screen-md text-center text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
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
                  date,
                  body,
                  subtitle,
                  estimatedReadingTime,
                }: SanityDocument) => {
                  const shortDescription =
                    description || toPlainText(body).substring(0, 190) + '...'
                  return (
                    <div key={slug} className="gap-5 p-8">
                      <div className="justify-left flex w-full sm:justify-between">
                        <div>
                          <h2 className="font-heading text-2xl font-semibold underline decoration-white transition hover:decoration-slate-500 sm:text-xl lg:text-3xl">
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
                              <a className="inline-flex rounded-lg bg-black/10 px-4 py-2 text-lg font-medium transition hover:bg-slate-300">
                                Leer
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
