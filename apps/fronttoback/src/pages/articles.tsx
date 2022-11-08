import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getAllArticles} from 'lib/articles'
import {SanityDocument} from '@sanity/client'
import {getOgImage} from 'utils/get-og-image'
import Link from 'next/link'
import cx from 'classnames'
import {toPlainText} from '@portabletext/react'
import {useReducedMotion} from 'framer-motion'

type ArticlesPageProps = {
  articles: SanityDocument[]
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({articles}) => {
  const title = 'Articles'
  const ogImage = getOgImage(title)

  return (
    <Layout meta={{title, ogImage}}>
      <Header title={title} />
      <main className="sm:p-10 p-5 sm:pt-16 pt-16">
        <div className="flex flex-col gap-14 max-w-5xl mx-auto">
          {articles?.map((article) => {
            const {title, slug, body} = article
            const description =
              article.description || toPlainText(body).substring(0, 157) + '...'
            return (
              <article key={slug}>
                <h2>
                  <Link href={slug}>
                    <a className="sm:fluid-3xl fluid-2xl font-bold hover:underline !leading-tight">
                      {title}
                    </a>
                  </Link>
                </h2>
                <div className="pt-4 text-lg md:text-xl">{description}</div>
              </article>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export default ArticlesPage

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="sm:pt-48 pt-48 sm:p-10 p-5 bg-brand-orange relative overflow-hidden">
      <h1 className="fluid-5xl font-bold max-w-5xl mx-auto w-full">Articles</h1>
      <svg
        className={cx(
          'absolute -right-24 -top-24 text-[#E47A53] sm:w-[500px] w-[400px]',
          {
            'animate-spin-slow': !shouldReduceMotion,
          },
        )}
        viewBox="0 0 564 564"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M307.881 220.567L463.155 65.293L499.324 101.462L344.05 256.736H563.642V307.881L344.05 307.881L499.324 463.155L463.155 499.324L307.881 344.05L307.881 563.642H256.736V344.05L101.462 499.324L65.293 463.155L220.567 307.881H0.97522L0.97522 256.736H220.567L65.293 101.462L101.462 65.293L256.736 220.567V0.97522L307.881 0.97522V220.567Z"
          fill="currentColor"
        />
      </svg>
    </header>
  )
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const articles = await getAllArticles()

  return {
    props: {articles},
  }
}
