import * as React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {GetStaticPaths, GetStaticProps} from 'next'
import ArticleTemplate from '@/templates/article-template'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

const MDX_ARTICLES_FOLDER = 'src/content/articles'

export interface FrontMatter {
  title: string
  slug: string
  date: string
  image: string
  socialImage: string
  imageAlt?: string
  excerpt: string
  keywords?: string[] | null
}

export interface ArticleProps {
  mdx: MDXRemoteSerializeResult
  frontMatter: FrontMatter
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const filePath = path.join(
    process.cwd(),
    MDX_ARTICLES_FOLDER,
    `${params?.article as string}.mdx`,
  )
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const {content, data} = matter(fileContents)
  if (data.date instanceof Date) {
    data.date = data.date.toISOString()
  }
  const keywords = Array.isArray(data.keywords) ? data.keywords : null
  const frontMatter: FrontMatter = {
    title: data.title,
    slug: data.slug,
    date: data?.date,
    image: data?.image,
    socialImage: data?.socialImage,
    imageAlt: data?.imageAlt,
    excerpt: data.excerpt,
    keywords,
  }
  const mdxSource = await serializeMDX(content)

  return {
    props: {
      mdx: mdxSource,
      frontMatter,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), MDX_ARTICLES_FOLDER)
  const filenames = fs.readdirSync(postsDirectory)
  const paths = filenames.map((filename) => {
    return {
      params: {
        article: filename.replace(/\.mdx$/, ''),
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

const Article: React.FC<ArticleProps> = ({mdx, frontMatter}) => {
  return <ArticleTemplate mdx={mdx} frontMatter={frontMatter} />
}

export default Article
