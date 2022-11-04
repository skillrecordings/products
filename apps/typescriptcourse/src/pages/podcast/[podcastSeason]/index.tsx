import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import {
  getAllPodcastSeasons,
  getPodcastSeason,
  PodcastSeason,
} from '../../../lib/podcast'
import Link from 'next/link'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/app/layout'
import {PortableText, toPlainText} from '@portabletext/react'
import {useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'

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

const PodcastSeasonPage = ({season}: {season: PodcastSeason}) => {
  return <EpisodeIndexLayout season={season} />
}

const EpisodeIndexLayout: React.FC<{season: PodcastSeason}> = ({season}) => {
  const {title, episodes, content, description} = season

  const ogImage = getOgImage(title)
  const shortDescription = description
    ? description
    : content
    ? toPlainText(content).substring(0, 157) + '...'
    : ''
  const router = useRouter()

  return (
    <Layout
      meta={{
        ogImage,
        title,
        description: shortDescription,
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <div className="overflow-hidden">
        <div className="w-full max-w-screen-sm px-5 mx-auto overflow-hidden sm:pb-24">
          <header className="relative sm:pt-20 pt-10 overflow-hidden text-white md:pt-24 pb-10">
            <p className="mb-4 text-sm md:text-base font-heading opacity-95">
              Podcast Season One
            </p>
            <h1 className="text-3xl font-bold leading-none font-heading sm:text-4xl lg:text-5xl">
              Learn How to{' '}
              <span className="text-transparent bg-gradient-to-l from-blue-200 to-white bg-clip-text decoration-clone">
                {title}
              </span>
            </h1>
          </header>
          <Providers />
          <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto prose-headings:mx-auto md:prose-headings:max-w-screen-sm md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
            <PortableText value={content} components={PortableTextComponents} />
          </div>
          <h2 className="mt-20 text-2xl font-bold mb-10">Episodes</h2>
          {episodes.map((episode) => (
            <Link
              key={episode.slug}
              href={`/podcast/${season.slug}/${episode.slug}`}
            >
              <a className="group focus:outline-none">
                <div className="grid max-w-screen-xl gap-4 mx-auto grid-cols-6 center mb-10">
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
                  <h3 className="col-span-4 mb-3 font-semibold lg:mb-0 sm:text-lg text-base">
                    {episode.title}
                  </h3>
                  <p className="text-right opacity-80 text-sm">
                    {episode.duration}
                  </p>
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

const Providers = () => {
  return (
    <div className="flex sm:flex-row flex-col gap-5 mx-auto max-w-screen-lg w-full">
      <a
        href="https://open.spotify.com/show/5fVWxK2CksFsxm7Di7pvhY"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image
          src="/images/podcast/spotify.svg"
          height={50}
          width={140}
          alt=""
          aria-hidden="true"
        />
        <span className="sr-only">Listen on Spotify</span>
      </a>
      <a
        href="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5zaW1wbGVjYXN0LmNvbS9hSXZVRW4wQw"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image
          src="/images/podcast/google.svg"
          alt=""
          height={50}
          width={140}
          aria-hidden="true"
        />
        <span className="sr-only">Listen on Google Podcasts</span>
      </a>
      <a
        href="https://podcasts.apple.com/us/podcast/typescript-course/id1652584793?i=1000584717001"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image
          src="/images/podcast/apple.svg"
          alt=""
          height={50}
          width={140}
          aria-hidden="true"
        />
        <span className="sr-only">Listen on Apple Podcasts</span>
      </a>
    </div>
  )
}

export default PodcastSeasonPage
