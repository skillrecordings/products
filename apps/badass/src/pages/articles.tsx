import * as React from 'react'
import Layout from 'components/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {GetStaticProps} from 'next'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'
import {getAllArticles} from '../lib/articles'
import Image from 'next/image'
import Stars from '../../public/assets/stars-1@2x.png'
import {Author} from 'templates/article-template'

const meta = {
  title: 'Badass Articles',
  ogImage: {
    url: 'https://badass.dev/card@2x.png',
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<React.PropsWithChildren<ArticlesProps>> = ({
  articles,
}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <header className="sm:py-10 py-24 px-16 relative">
        <Image
          src={Stars}
          alt=""
          aria-hidden="true"
          layout="fill"
          className="sm:object-contain object-scale-down sm:scale-100 scale-50 pointer-events-none select-none"
        />
        <h1 className="relative z-10 max-w-screen-md font-expanded bg-gradient-to-tr from-badass-pink-500/80 via-badass-pink-400/50 to-badass-black bg-clip-text text-transparent font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Badass Articles
        </h1>
      </header>
      <main className="px-3 flex-grow">
        <div className="pb-16 mx-auto max-w-3xl w-full sm:pt-20 gap-16">
          <div className="grid grid-cols-1 gap-20">
            {articles.map(
              ({title, slug, description, date}: SanityDocument, i: number) => {
                return (
                  <div key={slug} className="sm:gap-5 gap-3 flex">
                    <i
                      aria-hidden="true"
                      className="font-symbol sm:text-5xl text-4xl text-badass-yellow-300"
                    >
                      o
                    </i>
                    <div className="flex w-full sm:justify-between justify-left">
                      <div>
                        <Link href={`/${slug}`} passHref>
                          <a className="group block">
                            <h2 className="group-hover:underline md:text-4xl sm:text-3xl text-xl font-heading">
                              {title}
                            </h2>
                          </a>
                        </Link>
                        <div className="flex items-center pt-5 gap-8">
                          <Author />
                          <time dateTime={date} className="block opacity-80">
                            {format(new Date(date), 'dd MMMM, y')}
                          </time>
                        </div>
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
                          className="font-condensed sm:text-2xl text-xl text-badass-yellow-300 tracking-widest flex items-baseline gap-1"
                          aria-label={`Read ${title}`}
                        >
                          Read
                        </a>
                      </Link>
                    )} */}
                  </div>
                )
              },
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const articles = await getAllArticles()

  return {
    props: {
      articles,
    },
    revalidate: 10,
  }
}

export default Articles
