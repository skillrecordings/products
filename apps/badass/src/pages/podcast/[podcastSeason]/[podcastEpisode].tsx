import * as React from 'react'

import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next'
import Layout from '../../../components/layout'
import PodcastPlayer from '../../../components/podcast-player'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  getPodcastSeason,
  PodcastEpisode,
} from '../../../lib/podcast'
import Markdown from 'react-markdown'
import {isEmpty} from 'lodash'
import {genericCallToActionContent} from '../../../components/landing-content'
import {CallToActionForm} from '../../../components/call-to-action-form'

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
  const {title, summary, publishedAt, coverArtUrl} = episode

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: summary,
        type: 'article',
        date: publishedAt,
        url: `${process.env.NEXT_PUBLIC_URL}/podcast/course_builders/${episode.slug}`,
        titleAppendSiteName: true,
        ogImage: {
          url: `https://badass-ogimage.vercel.app/api/card?title=${title}&image=https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${coverArtUrl}`,
          width: 1200,
          height: 628,
        },
        article: {
          publishedTime: publishedAt,
        },
      }}
    >
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
              return (
                <a key={link.URL} href={link.URL}>
                  {link.title}
                </a>
              )
            })}
          </section>
        )}

        <CallToActionForm content={genericCallToActionContent} />

        <section className="relative sm:pb-12 pb-6 flex flex-col px-5">
          <h2>Transcript</h2>
          <Markdown className="prose">{episode.transcript}</Markdown>
        </section>
      </main>
    </Layout>
  )
}

export default PodcastEpisode
