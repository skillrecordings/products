import * as React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  PodcastEpisode,
} from '../../../lib/podcast'
import Layout from 'components/app/layout'
import PortableTextComponents from 'components/portable-text'
import PodcastPlayer from 'components/podcast-player'
import Markdown from 'react-markdown'
import {PortableText, toPlainText} from '@portabletext/react'
import {useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const episode = await getPodcastEpisode(params?.podcastEpisode as string)

  return {
    props: {
      episode,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seasons = await getAllPodcastSeasons()

  const paths = seasons
    .reduce((acc: any[], season: any) => {
      return season.episodes.map((episode: any) => {
        return {
          params: {
            podcastSeason: season.slug,
            podcastEpisode: episode.slug,
          },
        }
      })
    }, [])
    .flatMap((path: any) => path)
  return {paths, fallback: 'blocking'}
}

const PodcastEpisodePage = ({episode}: any) => {
  return <EpisodeLayout episode={episode} />
}

const EpisodeLayout = ({episode}: {episode: PodcastEpisode}) => {
  const {title, simplecastId, transcript, content, description} = episode

  const ogImage = getOgImage(title)
  const shortDescription = description
    ? description
    : content
    ? toPlainText(content).substring(0, 157) + '...'
    : ''
  const router = useRouter()

  return (
    <Layout
      meta={{
        ogImage,
        title,
        description: shortDescription,
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <main className="max-w-screen-md px-5 mx-auto prose sm:py-16 py-5">
        <h1 className="max-w-screen-md py-4 mx-auto text-3xl font-bold leading-none font-heading sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <Markdown>{description}</Markdown>
        </div>
        <PodcastPlayer simplecastId={simplecastId} />
        <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <PortableText value={content} components={PortableTextComponents} />
        </div>
        <div className="mt-20 prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <h2>Transcript</h2>
          <Markdown>{transcript}</Markdown>
        </div>
      </main>
    </Layout>
  )
}

export default PodcastEpisodePage
