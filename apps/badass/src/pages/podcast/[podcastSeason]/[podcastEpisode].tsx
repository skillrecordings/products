import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import PodcastEpisodeTemplate from 'templates/podcast-episode-template'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  type PodcastEpisode as PodcastEpisodeType,
} from 'lib/podcast'

import serializeMdx from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const episode = await getPodcastEpisode(params?.podcastEpisode as string)
  const episodeDescriptionSerialized = await serializeMdx(episode.description, {
    syntaxHighlighterOptions: {
      theme: 'one-dark-pro',
    },
  })
  const episodeTranscriptSerialized = await serializeMdx(episode.transcript)

  return {
    props: {
      episode,
      episodeDescriptionSerialized,
      episodeTranscriptSerialized,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
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

type PodcastEpisodeProps = {
  episode: PodcastEpisodeType
  episodeDescriptionSerialized: MDXRemoteSerializeResult
  episodeTranscriptSerialized: MDXRemoteSerializeResult
}

const PodcastEpisode: React.FC<PodcastEpisodeProps> = ({
  episode,
  episodeDescriptionSerialized,
  episodeTranscriptSerialized,
}) => {
  return (
    <PodcastEpisodeTemplate
      episode={episode}
      episodeDescriptionSerialized={episodeDescriptionSerialized}
      episodeTranscriptSerialized={episodeTranscriptSerialized}
    />
  )
}

export default PodcastEpisode
