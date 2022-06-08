import * as React from 'react'

import {GetServerSideProps} from 'next'
import Layout from '../../../components/layout'
import PodcastPlayer from '../../../components/podcast-player'
import {
  getPodcastEpisode,
  getPodcastSeason,
  PodcastEpisode,
} from '../../../lib/podcast'
import Markdown from 'react-markdown'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  if (params?.podcastEpisode) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    const episode = await getPodcastEpisode(params.podcastEpisode as string)
    if (episode) {
      return {
        props: {
          episode,
        },
      }
    } else {
      return {
        redirect: {
          destination: '/podcast',
          permanent: false,
        },
      }
    }
  } else {
    return {
      redirect: {
        destination: '/podcast',
        permanent: false,
      },
    }
  }
}
const PodcastEpisode: React.FC<{episode: PodcastEpisode}> = ({episode}) => {
  return (
    <Layout>
      <main className="prose">
        <h1>{episode.title}</h1>
        <PodcastPlayer simplecastId={episode.simplecastId} />
        <section className="relative sm:pb-16 pb-8 flex flex-col items-center justify-center  px-5">
          <Markdown className="prose">{episode.description}</Markdown>
        </section>
        <section className="relative sm:pb-16 pb-8 flex flex-col items-center justify-center  px-5">
          <h2>Transcript</h2>
          <Markdown className="prose">{episode.transcript}</Markdown>
        </section>
      </main>
    </Layout>
  )
}

export default PodcastEpisode
