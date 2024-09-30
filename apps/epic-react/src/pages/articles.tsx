import {NextPage, GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {type Article} from '@/lib/articles'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import {getAllArticles} from '@/lib/articles'
import {track} from '@/utils/analytics'
import ResourceContributor from '@/components/resource-contributor'
import {cn} from '@skillrecordings/ui/utils/cn'

const formattedDate = (date: string) => {
  const newDate = new Date(date)
  return newDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const ArticlesPage: NextPage<{articles: Article[]}> = ({articles}) => {
  const title = 'Epic React Articles'
  const latestArticle = articles[0]
  const restArticles = articles.slice(1)

  return (
    <Layout
      meta={{
        title,
      }}
    >
      <main className="mx-auto w-full max-w-screen-lg px-5 py-8 sm:py-10">
        <h1 className="mb-4 text-xl font-semibold leading-tight sm:text-2xl">
          {title}
        </h1>
        <div className="flex w-full flex-col">
          {latestArticle && (
            <ArticleTeaser
              article={latestArticle}
              className="group relative mb-5 flex h-full w-full flex-col overflow-hidden rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-2xl shadow-gray-500/20 transition dark:shadow-none dark:hover:bg-gray-900/40 md:aspect-[16/6] [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_p]:text-white/90 [&_p]:dark:text-white/90"
              contributorClassName="text-white/90 dark:text-white/90"
            />
          )}
          <ul className="grid w-full grid-cols-1 flex-col gap-5 pb-10 sm:grid-cols-2 lg:gap-5">
            {restArticles.map((article) => {
              return (
                <li className="flex" key={article._id}>
                  <ArticleTeaser article={article} />
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export const ArticleTeaser = ({
  article,
  className,
  contributorClassName,
}: {
  article: Article
  className?: string
  contributorClassName?: string
}) => {
  const {title, image, slug, summary, body} = article

  return (
    <article key={slug}>
      <Link
        href={slug}
        passHref
        onClick={() => {
          track('clicked start reading article', {
            article: slug,
          })
        }}
        className={cn(
          'group relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl shadow-gray-500/20 transition dark:bg-white/5 dark:shadow-none dark:hover:bg-gray-800',
          className,
        )}
      >
        <div className="flex h-full flex-col justify-between rounded-lg border border-transparent px-5 py-8 dark:border-gray-900 md:px-8">
          <div className="relative z-10">
            <h2 className="text-balance text-2xl font-bold">{title}</h2>
            {summary && (
              <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                {summary}
              </p>
            )}
          </div>
          <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
            <div className="flex w-full items-center gap-10 text-sm">
              <ResourceContributor
                as="div"
                className={cn(
                  'text-sm font-normal [&_img]:w-10 [&_span]:font-bold',
                  contributorClassName,
                )}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allArticles = await getAllArticles()

  const articles = [...allArticles]
    .sort((a: Article, b: Article) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .filter(({state}) => {
      return state === 'published'
    })

  return {
    props: {
      articles,
    },
    revalidate: 10,
  }
}

export default ArticlesPage
