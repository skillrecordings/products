import * as React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Markdown from 'react-markdown'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {format} from 'date-fns'
import {SanityDocument} from '@sanity/client'

const meta = {
  title: 'Accessibility Articles',
  ogImage: {
    url: 'https://testingaccessibility.com/assets/accessibility-articles-card@2x.png',
  },
}

type ArticlesProps = {
  articles: SanityDocument[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  return (
    <Layout meta={meta}>
      <header className="relative px-5 py-28 overflow-hidden text-white bg-green-700 bg-noise">
        <h1 className="max-w-screen-md font-aglet-slab font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Accessibility Articles
        </h1>
      </header>
      <main className="px-5 flex-grow">
        <div className="pb-16 mx-auto max-w-lg w-full pt-16 gap-16">
          <div className="grid grid-cols-1 gap-5">
            {articles.map(
              ({title, slug, description, date}: SanityDocument) => {
                return (
                  <div key={slug} className="gap-5">
                    <div className="flex w-full sm:justify-between justify-center">
                      <div>
                        <Link href={`/${slug}`} passHref>
                          <a className="group">
                            <h2 className="text-green-600 group-hover:underline sm:text-3xl font-aglet-slab text-xl font-bold">
                              {title}
                            </h2>
                          </a>
                        </Link>
                        <time
                          dateTime={date}
                          className="block pt-1 text-lg font-dinosaur font-medium"
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
                    {slug && (
                      <Link href={`/${slug}`} passHref>
                        <a
                          className="px-3 py-2 rounded-md hover:bg-moss-200/50 transition bg-moss-100 text-green-600 font-semibold inline-flex"
                          aria-label={`Sign up for the workshop on ${title}`}
                        >
                          Read
                          <i aria-hidden className="pl-2">
                            →
                          </i>
                        </a>
                      </Link>
                    )}
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

const articlesQuery = groq`*[_type == "article"] | order(date asc){
    title,
    'slug': slug.current,
    description,
    body,
    published,
    image,
    date
}`

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const data = await sanityClient.fetch(articlesQuery)

  return {
    props: {articles: data},
  }
}

export default Articles
