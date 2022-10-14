import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import {
  getAllPodcastSeasons,
  getPodcastSeason,
  PodcastSeason,
} from '../../../lib/podcast'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const season = await getPodcastSeason(params?.podcastSeason as string)

  return {
    props: {
      season,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seasons = await getAllPodcastSeasons()

  const paths = seasons.map((season: any) => {
    return {
      params: {
        podcastSeason: season.slug,
      },
    }
  })
  return {paths, fallback: 'blocking'}
}

const PodcastSeason: React.FC<{season: PodcastSeason}> = ({season}) => {
  return (
    <Layout>
      <div className="overflow-hidden">
        <div className="w-full max-w-screen-sm px-5 mx-auto overflow-hidden">
          <header className="relative pt-20 pb-10 overflow-hidden text-white md:pt-24 lg:py-20">
            <p className="mb-4 text-lg md:text-xl font-heading opacity-95">
              Podcast Season One
            </p>
            <h1 className="text-3xl font-bold leading-none font-heading sm:text-4xl lg:text-5xl">
              Learn How to{' '}
              <span className="text-transparent bg-gradient-to-l from-red-300 to-white bg-clip-text decoration-clone">
                {season.title}
              </span>
            </h1>
          </header>
          <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto prose-headings:mx-auto md:prose-headings:max-w-screen-sm md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
            <PortableText
              value={season.content}
              components={PortableTextComponents}
            />
          </div>
          <h2 className="mt-20 text-3xl font-bold mb-10">Episodes</h2>
          {season.episodes.map((episode, index) => (
            <Link
              key={episode.slug}
              href={`/podcast/${season.slug}/${episode.slug}`}
            >
              <a className="group focus:outline-none">
                <div className="grid max-w-screen-xl gap-4 mx-auto grid-cols-6 center mb-10 items-center">
                  <div className="relative flex-none col-span-1">
                    <div className="absolute inset-0 flex items-center justify-center transition transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus:opacity-100">
                      <div className="flex-none p-4 text-gray-800 bg-white rounded-full bg-opacity-80">
                        <TriangleIcon />
                      </div>
                    </div>
                    <Image
                      className="object-cover w-full rounded-lg h-18"
                      src={episode.coverArtUrl}
                      alt={episode.title}
                      width={500}
                      height={500}
                      quality="%100"
                    />
                  </div>

                  <div className="col-span-4 mb-3 text-xl font-bold lg:mb-0">
                    <span className="inline-block w-10 font-normal lg:text-lg">
                      {`${(index + 1).toString().padStart(2, '0')}.`}
                    </span>
                    {episode.title}
                  </div>
                  <p className="text-right opacity-80">{episode.duration}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function TriangleIcon({size = 24}: {size?: number}) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
      />
    </svg>
  )
}

export default PodcastSeason
