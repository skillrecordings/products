import * as React from 'react'
import {isEmpty} from 'lodash'
import {useScroll, useTransform} from 'framer-motion'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

import {type PodcastEpisode} from 'lib/podcast'
import Layout from 'components/layout'
import PodcastPlayer from 'components/podcast-player'
import {genericCallToActionContent} from 'components/landing-content'
import {CallToActionForm} from 'components/call-to-action-form'
import PodcastParallaxImages from 'components/podcast-parallax-images'
import mdxComponents from 'components/mdx'
import FancyTitleWithSubtitle from 'components/mdx/components/fancy-title-with-subtitle'
import FullTranscript from 'components/mdx/components/full-transcript'
import ResourcesLinks from 'components/mdx/components/resources-links'

type PodcastEpisodeTemplateProps = {
  episode: PodcastEpisode
  episodeDescriptionSerialized: MDXRemoteSerializeResult
  episodeTranscriptSerialized: MDXRemoteSerializeResult
}

const PodcastEpisodeTemplate: React.FC<PodcastEpisodeTemplateProps> = ({
  episode,
  episodeDescriptionSerialized,
  episodeTranscriptSerialized,
}) => {
  const {title, summary, publishedAt, coverArtUrl} = episode
  const ref = React.useRef(null)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end center'],
  })
  const y = useTransform(scrollYProgress, [0, 3], [1000, -5000])
  const formattedLinks = episode?.links
    ? episode.links
        .map((item) => ({
          ...item,
          url: item.URL,
          URL: undefined,
        }))
        .map(({URL, ...rest}) => rest)
    : []
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
      <header className="mt-16 md:mt-24 lg:mt-28 px-5">
        <div className="container">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="text-badass-yellow-500 font-script text-3xl sm:text-4xl md:text-[2.5rem] leading-[0.6]">
              Podcast
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.2] md:leading-[1.2] lg:leading-[1.2]">
              {episode.title}
            </h1>
          </div>
        </div>
      </header>
      <main className="mt-16 md:mt-24 lg:mt-32">
        <div className="container">
          <div className="max-w-screen-md mx-auto">
            <PodcastPlayer simplecastId={episode.simplecastId} />
            <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] font-medium first-letter:text-badass-pink-500 first-letter:text-[2.5rem] md:first-letter:text-[3rem] lg:first-letter:text-[4rem] first-letter:float-left first-letter:leading-none first-letter:font-expanded first-letter:mr-2 md:first-letter:mr-3 mt-20">
              <MDX
                components={mdxComponents}
                contents={episodeDescriptionSerialized}
              />
            </article>
            {!isEmpty(formattedLinks) && (
              <section className="sm:text-lg lg:text-xl pt-12">
                <FancyTitleWithSubtitle
                  subtitle="Check Out"
                  title="The Links"
                />
                <ResourcesLinks resources={formattedLinks} />
              </section>
            )}
          </div>
          <section
            className="flex flex-col items-center justify-center relative mb-28"
            ref={ref}
          >
            <div className="max-w-screen-md mx-auto">
              <FancyTitleWithSubtitle subtitle="Read" title="Full Transcript" />
              <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] mb-2 font-medium">
                <FullTranscript>
                  <MDX
                    components={mdxComponents}
                    contents={episodeTranscriptSerialized}
                  />
                </FullTranscript>
              </article>
            </div>
            <div className="lg:flex items-center justify-center hidden w-full mx-auto">
              <PodcastParallaxImages y={y} />
            </div>
          </section>
        </div>
      </main>
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export default PodcastEpisodeTemplate
