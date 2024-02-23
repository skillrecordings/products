import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Layout from '@/components/app/layout'
import {GetStaticProps, NextPage} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {type Article} from '@/@types/mdx-articles'

interface ArticlesPageProps {
  articles: Article[]
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
        <h1>Articles</h1>
        <ul className="grid grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <li key={index}>
              <Link
                href={article.slug}
                className="block h-full border border-white p-4"
              >
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <Image
                  src={`/articles-images${article.image}`}
                  alt={`Cover image for ${article.title}`}
                  width={2280}
                  height={1080}
                />
                <p>Date: {article.date}</p>
              </Link>
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
