import * as React from 'react'

import {GetServerSideProps} from 'next'
import Layout from '../../components/layout'
import PodcastPlayer from '../../components/podcast-player'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  return {
    props: {
      episode: {
        simplecastId: '2e0ab801-425f-428f-a570-641b41e21318',
      },
    },
  }
}

const PodcastEpisode: React.FC<{episode?: any}> = ({episode}) => {
  return (
    <Layout>
      <PodcastPlayer simplecastId={episode.simplecastId} />
    </Layout>
  )
}

export default PodcastEpisode
