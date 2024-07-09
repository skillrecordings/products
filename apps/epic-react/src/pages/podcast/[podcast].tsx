import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {PodcastFrontMatter} from '@/@types/mdx-podcast'
import PodcastTemplate from '@/templates/podcast-template'
import {getPodcastData, getAllPodcasts} from '@/utils/get-podcasts'

export interface PodcastPageProps {
  allPodcasts: PodcastFrontMatter[]
  mdx: MDXRemoteSerializeResult
  frontMatter: PodcastFrontMatter
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const slug = params?.podcast as string
    const {mdxSource, frontMatter} = await getPodcastData(slug)
    const allPodcasts = getAllPodcasts()

    return {
      props: {
        allPodcasts,
        mdx: mdxSource,
        frontMatter,
      },
    }
  } catch (error) {
    console.error(error)
    return {notFound: true}
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPodcasts = getAllPodcasts()
  const paths = allPodcasts.map((podcast) => ({
    params: {podcast: podcast.slug},
  }))

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
