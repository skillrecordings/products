import {toPlainText} from '@portabletext/react'
import Layout from 'components/app/layout'
import {Article, getAllArticles} from 'lib/articles'
import {drop, first} from 'lodash'
import Image from 'next/image'
import Link from 'next/link'

export async function getStaticProps() {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

type ArticlesIndex = {
  articles: Article[]
}

const Articles: React.FC<ArticlesIndex> = ({articles}) => {
  const publishedArticles = articles.filter(({state}) => state === 'published')
  const latestArticle = first(publishedArticles)
  const restArticles = drop(publishedArticles, 1)

  return (
    <Layout
      className="bg-black/40"
      meta={{
        title: 'TypeScript Articles by Matt Pocock',
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1670957524/articles-card_2x_mxwbzs.png',
          alt: 'TypeScript Articles',
        },
      }}
    >
      <main className="mx-auto flex h-full w-full max-w-4xl flex-grow flex-col gap-5 py-20 px-5 md:py-32">
        <h1 className="mb-8 border-b border-gray-800 pb-3 text-lg font-medium sm:mb-10">
          TypeScript Articles{' '}
          <span className="font-light text-gray-300">by Matt Pocock</span>
        </h1>
        {latestArticle && (
          <article className="w-full" key={latestArticle.slug}>
            <Link href={latestArticle.slug}>
              <a className="group block">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  {latestArticle.image && (
                    <Image
                      className="transition duration-500 ease-in-out group-hover:scale-105"
                      src={latestArticle.image}
                      alt=""
                      aria-hidden="true"
                      layout="fill"
                      quality={100}
                      priority
                    />
                  )}
                </div>
                <h2 className="max-w-3xl pt-10 font-text text-3xl font-bold sm:text-4xl">
                  {latestArticle.title}
                </h2>
                <p className="max-w-xl pt-5 leading-relaxed text-gray-300">
                  {latestArticle.summary
                    ? toPlainText(latestArticle.summary)
                    : latestArticle.body
                    ? toPlainText(latestArticle.body).slice(0, 400)
                    : ''}
                </p>
                <Author />
              </a>
            </Link>
          </article>
        )}
        <div className="grid grid-cols-1 gap-10 pt-5 sm:grid-cols-2 sm:gap-5 sm:pt-16 md:gap-10">
          {restArticles &&
            restArticles.map((article) => {
              return <ArticleTeaser article={article} key={article.slug} />
            })}
        </div>
      </main>
    </Layout>
  )
}

type ArticleTeaserProps = {
  article: Article
}

export const ArticleTeaser: React.FC<ArticleTeaserProps> = ({article}) => {
  const {title, summary: _summary, body, image} = article
  const summary = _summary
    ? toPlainText(_summary)
    : body
    ? toPlainText(body).slice(0, 400)
    : ''

  return (
    <article className="w-full">
      <Link href={article.slug}>
        <a className="group block">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-800/60">
            {image && (
              <Image
                className="transition duration-500 ease-in-out group-hover:scale-105"
                src={image}
                alt=""
                aria-hidden="true"
                layout="fill"
                quality={100}
              />
            )}
          </div>
          <h2 className="pt-5 font-text text-3xl font-bold">{title}</h2>
          <p className="pt-3 leading-relaxed text-gray-300">{summary}</p>
          <Author />
        </a>
      </Link>
    </article>
  )
}

export default Articles

const Author = () => {
  return (
    <div className="mt-5 flex items-center gap-2">
      <div className="flex items-center justify-center overflow-hidden rounded-full">
        <Image
          placeholder="blur"
          src={require('../../public/matt-pocock.jpeg')}
          alt="Matt Pocock"
          width={40}
          height={40}
        />
      </div>
      <span>Matt Pocock</span>
    </div>
  )
}
