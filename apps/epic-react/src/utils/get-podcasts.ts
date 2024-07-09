import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {PodcastFrontMatter} from '@/@types/mdx-podcast'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

const isPodcastDirectory = (dir: string) => {
  return (
    fs
      .statSync(path.join(process.cwd(), 'src/content/podcast', dir))
      .isDirectory() && !dir.startsWith('.')
  ) // This will exclude .DS_Store and other hidden files/folders
}

export async function getPodcastData(slug: string) {
  const directory = path.join(process.cwd(), 'src/content/podcast')
  const subfolder = fs
    .readdirSync(directory)
    .filter(isPodcastDirectory)
    .find((dir) => dir.endsWith(slug))
  if (!subfolder) throw new Error('Podcast not found')

  const filePath = path.join(directory, subfolder, 'index.mdx')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const {content, data} = matter(fileContents)
  const mdxSource = await serializeMDX(content, {scope: data})

  return {mdxSource, frontMatter: data}
}

export function getAllPodcasts(): PodcastFrontMatter[] {
  const directory = path.join(process.cwd(), 'src/content/podcast')
  return fs
    .readdirSync(directory)
    .filter(isPodcastDirectory)
    .map((subfolder) => {
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
}
