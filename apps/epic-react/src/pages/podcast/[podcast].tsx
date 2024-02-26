import * as React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {GetStaticPaths, GetStaticProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

import {type PodcastFrontMatter} from '@/@types/mdx-podcast'
import PodcastTemplate from '@/templates/podcast-template'

export interface PodcastPageProps {
  allPodcasts: PodcastFrontMatter[]
  mdx: MDXRemoteSerializeResult
  frontMatter: PodcastFrontMatter
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const slug = params?.podcast
    const directory = path.join(process.cwd(), 'src/content/podcast')
    const subfolder = fs
      .readdirSync(directory)
      .find((dir) => dir.endsWith(slug as string))
    if (!subfolder) throw new Error('Podcast not found')

    const filePath = path.join(directory, subfolder, 'index.mdx')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const {content, data} = matter(fileContents)
    const mdxSource = await serializeMDX(content, {scope: data})

    const allPodcasts = fs.readdirSync(directory).map((subfolder) => {
      const file = fs.readFileSync(
        path.join(directory, subfolder, 'index.mdx'),
        'utf8',
      )
      const {data} = matter(file)
      return {
        title: data.title,
        slug: subfolder.replace(/^\d{2}-/, ''),
        number: data.number,
        description: data.description,
        simplecastId: data.simplecastId,
        image: data.image,
      }
    })

    return {
      props: {
        allPodcasts,
        mdx: mdxSource,
        frontMatter: data,
      },
    }
  } catch (error) {
    console.error(error)
    return {notFound: true}
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const directory = path.join(process.cwd(), 'src/content/podcast')
  const subfolders = fs.readdirSync(directory)

  const paths = subfolders.map((subfolder) => {
    const slug = subfolder.replace(/^\d{2}-/, '')
    return {params: {podcast: slug}}
  })

  return {paths, fallback: 'blocking'}
}

const PodcastPage: React.FC<PodcastPageProps> = ({
  allPodcasts,
  mdx,
  frontMatter,
}) => {
  return (
    <PodcastTemplate
      allPodcasts={allPodcasts}
      mdx={mdx}
      frontMatter={frontMatter}
    />
  )
}

export default PodcastPage
