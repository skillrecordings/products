import * as React from 'react'

import {GetServerSideProps} from 'next'
import Layout from '../../../components/layout'
import PodcastPlayer from '../../../components/podcast-player'
import {
  getPodcastEpisode,
  getPodcastSeason,
  PodcastEpisode,
} from '../../../lib/podcast'

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
      <PodcastPlayer simplecastId={episode.simplecastId} />
    </Layout>
  )
}

export default PodcastEpisode
