import * as React from 'react'
import {useScroll, motion, useTransform} from 'framer-motion'
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next'
import Layout from '../../../components/layout'
import PodcastPlayer from '../../../components/podcast-player'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  getPodcastSeason,
  PodcastEpisode,
} from '../../../lib/podcast'
import ReactMarkdown from 'react-markdown'
import {isEmpty} from 'lodash'
import {genericCallToActionContent} from '../../../components/landing-content'
import {
  CallToActionForm,
  SmallCallToActionForm,
} from '../../../components/call-to-action-form'
import {ParallaxImages} from '.'

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
  const ref = React.useRef(null)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end center'],
  })
  const y = useTransform(scrollYProgress, [0, 3], [1000, -5000])
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
          url: `https://badass-ogimage.vercel.app/api/card?title=${encodeURI(
            title,
          )}&image=https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${coverArtUrl}`,
          width: 1200,
          height: 628,
        },
        article: {
          publishedTime: publishedAt,
        },
      }}
    >
      <header className="max-w-screen-md mx-auto w-full pt-10 px-5">
        <div className="font-expanded md:text-sm text-xs text-badass-yellow-300 pb-3">
          Podcast
        </div>
        <h1 className="font-heading lg:text-5xl sm:text-4xl text-3xl lg:leading-tight sm:leading-tight leading-tight">
          {episode.title}
        </h1>
      </header>
      <main>
        <div className="max-w-screen-md w-full mx-auto">
          <PodcastPlayer simplecastId={episode.simplecastId} />
          <article className="px-5">
            <ReactMarkdown className="prose sm:prose-lg lg:prose-xl pt-3 max-w-3xl prose-p:text-neutral-200 first-letter:text-6xl first-letter:pr-3 first-letter:-mt-0.5 first-line:text-badass-pink-300 first-letter:font-expanded first-letter:float-left first-letter:text-badass-pink-500">
              {episode.description}
            </ReactMarkdown>
            {isEmpty(episode.links) ? null : (
              <section className="sm:text-lg lg:text-xl pt-12">
                <h2 className="font-expanded text-badass-pink-500 text-2xl pb-5">
                  Links
                </h2>
                <ul className="space-y-2">
                  {episode.links.map((link) => {
                    return (
                      <li key={link.URL}>
                        <a
                          className="underline decoration-white/40 hover:decoration-white/80 transition text-neutral-200"
                          href={link.URL}
                        >
                          {link.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </article>
        </div>
        <SmallCallToActionForm content={genericCallToActionContent} />
        <section
          className="flex flex-col items-center justify-center relative"
          ref={ref}
        >
          <h2 className="sm:text-4xl text-2xl font-expanded bg-gradient-to-r from-neutral-500 to-neutral-700/60 bg-clip-text text-transparent sm:pt-32 pt-16 sm:pb-24 pb-16">
            Transcript
          </h2>
          <ReactMarkdown className="prose sm:prose-base prose-sm prose-p:text-neutral-300 max-w-3xl md:px-10 px-5">
            {episode.transcript}
          </ReactMarkdown>
          <div className="lg:flex items-center justify-center hidden w-full mx-auto">
            <ParallaxImages y={y} />
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default PodcastEpisode
