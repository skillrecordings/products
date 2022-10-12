import * as React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import PodcastPlayer from '../../../components/podcast-player'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  PodcastEpisode,
} from '../../../lib/podcast'
import Markdown from 'react-markdown'
import {isEmpty} from 'lodash'

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

const PodcastEpisode: React.FC<{episode: PodcastEpisode}> = ({episode}) => {
  const {title, simplecastId, transcript} = episode

  return (
    <div>
      <main className="prose px-5 py-28 max-w-screen-sm mx-auto">
        <h1>{title}</h1>
        <PodcastPlayer simplecastId={simplecastId} />
        <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
          <Markdown className="prose">{episode.description}</Markdown>
        </section>

        <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
          <h2>Transcript</h2>
          <Markdown className="prose">{transcript}</Markdown>
        </section>
      </main>
    </div>
  )
}

export default PodcastEpisode
