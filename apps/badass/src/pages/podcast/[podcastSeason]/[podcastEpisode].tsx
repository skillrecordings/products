import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import PodcastEpisodeTemplate from 'templates/podcast-episode-template'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  PodcastEpisode,
} from 'lib/podcast'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const episode = await getPodcastEpisode(params?.podcastEpisode as string)

  return {
    props: {
      episode,
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

const PodcastEpisode: React.FC<{episode: PodcastEpisode}> = ({episode}) => {
  return <PodcastEpisodeTemplate episode={episode} />
}

export default PodcastEpisode
