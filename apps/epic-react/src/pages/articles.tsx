import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {GetStaticProps, NextPage} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {type Article} from '@/@types/mdx-article'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'

interface ArticlesPageProps {
  articles: Article[]
}

const formattedDate = (date: string) => {
  const newDate = new Date(date)
  return newDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const ArticlesPage: NextPage<ArticlesPageProps> = ({articles}) => {
  const title = 'Articles'
  return (
    <Layout
      meta={{
        title,
        // openGraph: {
        //   images: [getOgImage({title})],
        // },
      }}
    >
      <main className="mx-auto w-full max-w-screen-lg px-5">
        <h1 className="text-center text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          Epic React Articles
        </h1>
        <Divider className="mb-16 mt-10" />
        <ul className="grid gap-5 sm:gap-8 md:grid-cols-2">
          {articles.map((article, index) => (
            <li key={index} className="flex">
              <article>
                <Link
                  href={article.slug}
                  className="flex h-full flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-[#f0f2f7] duration-200 hover:scale-105 hover:shadow-xl dark:border-[#132035]"
                >
                  <header className="relative aspect-[2/1] w-full shrink-0">
                    <Image
                      src={`/articles-images${article.image}`}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 690px, 460px"
                    />
                  </header>
                  <section className="flex h-full flex-col px-5 py-5 sm:px-8 sm:py-10">
                    <h2 className="pb-5 text-2xl font-semibold leading-tight sm:text-3xl">
                      {article.title}
                    </h2>
                    <div className="prose opacity-75 transition-opacity duration-200 ease-in-out hover:opacity-100">
                      <p>{article.excerpt}</p>
                    </div>
                  </section>
                  <footer className="w-full px-5 pb-5 text-left sm:px-8 sm:pb-8">
                    <span>{formattedDate(article.date)}</span>
                  </footer>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const directory = path.join(
    process.cwd(),
    process.env.NEXT_PUBLIC_MDX_ARTICLES_FOLDER as string,
  )
  const filenames = fs.readdirSync(directory)

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(directory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const {data} = matter(fileContents)
      const formattedDate =
        typeof data.date === 'string' ? data.date : data.date.toISOString()

      return {
        title: data.title,
        date: formattedDate,
        excerpt: data.excerpt,
        image: data.image,
        imageAlt: data.imageAlt,
        slug: filename.replace(/\.mdx$/, ''),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    props: {
      articles,
    },
  }
}

export default ArticlesPage
