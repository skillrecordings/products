import * as React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {GetStaticPaths, GetStaticProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

import {type ArticleFrontMatter, type Article} from '@/@types/mdx-article'
import ArticleTemplate from '@/templates/article-template'

export interface ArticlePageProps {
  allArticles: Article[]
  mdx: MDXRemoteSerializeResult
  frontMatter: ArticleFrontMatter
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  // try {
  //   const slug = params?.article
  //   const filePath = path.join(
  //     process.cwd(),
  //     process.env.NEXT_PUBLIC_MDX_ARTICLES_FOLDER as string,
  //     `${slug}.mdx`,
  //   )
  //   const fileContents = fs.readFileSync(filePath, 'utf8')
  //   const {content, data} = matter(fileContents)
  //   if (data.date instanceof Date) {
  //     data.date = data.date.toISOString()
  //   }
  //   const keywords = Array.isArray(data.keywords) ? data.keywords : null
  //   const frontMatter: ArticleFrontMatter = {
  //     title: data.title,
  //     slug: data.slug,
  //     date: data?.date,
  //     image: data?.image,
  //     socialImage: data?.socialImage,
  //     imageAlt: data?.imageAlt,
  //     excerpt: data.excerpt,
  //     keywords,
  //   }

  //   const mdxSource = await serializeMDX(content, {scope: data})

  //   const directory = path.join(
  //     process.cwd(),
  //     process.env.NEXT_PUBLIC_MDX_ARTICLES_FOLDER as string,
  //   )
  //   const filenames = fs.readdirSync(directory)

  //   const allArticles = filenames
  //     .map((filename) => {
  //       const filePath = path.join(directory, filename)
  //       const fileContents = fs.readFileSync(filePath, 'utf8')
  //       const {data} = matter(fileContents)
  //       const formattedDate =
  //         typeof data.date === 'string' ? data.date : data.date.toISOString()

  //       return {
  //         title: data.title,
  //         date: formattedDate,
  //         excerpt: data.excerpt,
  //         image: data.image,
  //         imageAlt: data.imageAlt,
  //         slug: filename.replace(/\.mdx$/, ''),
  //       }
  //     })
  //     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  //   return {
  //     props: {
  //       allArticles,
  //       mdx: mdxSource,
  //       frontMatter,
  //     },
  //   }
  // } catch (error) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {notFound: true}
  // if (process.env.NODE_ENV === 'production') {
  //   return {notFound: true}
  // }
  // return {props: {}}
}

export const getStaticPaths: GetStaticPaths = async () => {
  const directory = path.join(
    process.cwd(),
    process.env.NEXT_PUBLIC_MDX_ARTICLES_FOLDER as string,
  )
  const filenames = fs.readdirSync(directory)

  const paths = filenames.map((filename) => ({
    params: {article: filename.replace(/\.mdx$/, '')},
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

const ArticlePage: React.FC<ArticlePageProps> = ({
  allArticles,
  mdx,
  frontMatter,
}) => {
  return (
    <ArticleTemplate
      allArticles={allArticles}
      mdx={mdx}
      frontMatter={frontMatter}
    />
  )
}

export default ArticlePage
