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
import {isEmpty} from 'lodash'

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
          destination: '/podcast/course-builders',
          permanent: false,
        },
      }
    }
  } else {
    return {
      redirect: {
        destination: '/podcast/course-builders',
        permanent: false,
      },
    }
  }
}
const PodcastEpisode: React.FC<{episode: PodcastEpisode}> = ({episode}) => {
  return (
    <Layout className="overflow-hidden">
      <main className="prose px-5 py-28 max-w-screen-sm mx-auto">
        <h1>{episode.title}</h1>
        <PodcastPlayer simplecastId={episode.simplecastId} />
        <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
          <Markdown className="prose">{episode.description}</Markdown>
        </section>
        {isEmpty(episode.links) ? null : (
          <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
            <h2>Links</h2>
            {episode.links.map((link) => {
              return <a href={link.URL}>{link.title}</a>
            })}
          </section>
        )}
        <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
          <h2>Transcript</h2>
          <Markdown className="prose">{episode.transcript}</Markdown>
        </section>
      </main>
    </Layout>
  )
}

export default PodcastEpisode
