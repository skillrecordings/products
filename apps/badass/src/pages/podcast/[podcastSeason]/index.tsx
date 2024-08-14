import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import Link from 'next/link'
import Image from 'next/legacy/image'
import * as dateFns from 'date-fns'
import {PlayIcon} from '@heroicons/react/solid'
import {useScroll, motion, useTransform} from 'framer-motion'

import {
  getAllPodcastSeasons,
  getPodcastSeason,
  type PodcastSeason,
} from 'lib/podcast'
import Layout from 'components/layout'
import PodcastParallaxImages from 'components/podcast-parallax-images'
import GooglePodcasts from '../../../../public/assets/podcast/google.svg'
import SpotifyPodcasts from '../../../../public/assets/podcast/spotify.svg'
import ApplePodcasts from '../../../../public/assets/podcast/apple.svg'
import Tentacle from '../../../../public/assets/tentacle@2x.png'
import Joel from '../../../../public/joel-hooks.jpg'
import Vinyl from '../../../../public/assets/podcast/vinyl@2x.png'

function formatTime(seconds: number) {
  return dateFns.format(dateFns.addSeconds(new Date(0), seconds), 'mm:ss')
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const season = await getPodcastSeason(params?.podcastSeason as string)

  return {
    props: {
      season,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
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

const PodcastSeasonPage: React.FC<{season: PodcastSeason}> = ({season}) => {
  const ref = React.useRef(null)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end center'],
  })
  const y = useTransform(scrollYProgress, [0, 3], [1000, -5000])
  const title = season.title
  const description =
    'Season One of the Badass Courses podcast focuses on independent course creators that have built an audience, designed a course, and launched their courses on their own terms and often on their own platforms.'
  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description,
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}/assets/podcast/card@2x.png`,
          alt: title,
        },
      }}
    >
      <header className="relative px-5 md:pt-14 md:pb-16 pt-10 pb-16 max-w-screen-lg flex md:flex-row flex-col-reverse md:items-start justify-between mx-auto w-full gap-10">
        <div className="">
          <h1 className="sm:text-5xl text-4xl max-w-2xl font-heading sm:leading-tight">
            Podcast Season One: {season.title}
          </h1>
          <p className="sm:text-lg pt-10 max-w-lg text-badass-pink-300 brightness-110">
            {description}
          </p>
          <Host />
        </div>
        <div className="relative">
          <motion.div
            className="relative flex items-center justify-center"
            animate={{rotateZ: [17, 360]}}
            transition={{repeat: Infinity, ease: 'linear', duration: 360}}
          >
            <Image
              src={Vinyl}
              alt=""
              aria-hidden="true"
              width={650}
              height={650}
            />
          </motion.div>
          <div className="rounded-full bg-gradient-to-bl from-transparent to-white/10 mix-blend-lighten absolute w-full h-full top-0 left-0" />
          <div className="xl:block hidden absolute md:-bottom-80 bottom-0 md:-right-10 right-0 z-0 md:w-96 w-48 rotate-90">
            <Image src={Tentacle} alt="" aria-hidden="true" />
          </div>
        </div>
      </header>
      <main>
        <Providers />
        <h2 className="text-2xl tracking-wider max-w-screen-lg mx-auto w-full pb-5 px-5 font-condensed">
          {season.episodes.length} Episodes
        </h2>
        <div ref={ref} className="relative flex flex-col items-center">
          <PodcastParallaxImages y={y} />
          <div className="space-y-16 sm:p-24 p-10 bg-white/[0.07] max-w-screen-lg lg:mx-auto -mx-5 lg:rounded-xl">
            {season.episodes.map((episode) => (
              <div
                key={episode.slug}
                className="flex md:flex-row flex-col items-center md:space-x-10 md:space-y-0 space-y-10"
              >
                <Link
                  href={`/podcast/${season.slug}/${episode.slug}`}
                  className="group relative flex items-center justify-center flex-shrink-0 overflow-hidden"
                >
                  <Image
                    width={250}
                    height={250}
                    className="w-full rounded-lg object-cover"
                    src={`https://res.cloudinary.com/badass-courses/image/fetch/h_460,dpr_auto,f_auto,q_auto:good/${episode.coverArtUrl}`}
                    alt={episode.title}
                  />
                  <div className="group-hover:opacity-100 opacity-0 transition">
                    <PlayIcon className="w-8 absolute left-3 bottom-3 group-hover:scale-100 scale-50 group-hover:translate-y-0 translate-y-2 transition" />
                    {/* <div className="absolute pointer-events-none bottom-3 right-3 flex items-end gap-0.5 justify-end h-5">
                      {new Array(6).fill('').map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-white"
                          animate={{
                            height: [
                              `${Math.random() * 21}%`,
                              `${Math.random() * 101}%`,
                              `${Math.random() * 101}%`,
                              `${Math.random() * 81}%`,
                              `${Math.random() * 101}%`,
                            ],
                          }}
                          transition={{
                            repeat: Infinity,
                            repeatType: 'reverse',
                            type: 'spring',
                            duration: 1,
                          }}
                        />
                      ))}
                    </div> */}
                  </div>
                </Link>
                <div>
                  <h3 className="pl-8 md:pl-0">
                    <Link
                      key={episode.slug}
                      href={`/podcast/${season.slug}/${episode.slug}`}
                      className="sm:text-3xl text-2xl font-heading group focus:outline-none hover:underline"
                    >
                      {episode.title}
                    </Link>
                  </h3>
                  <p className="pt-5 sm:text-base sm:leading-relaxed text-sm px-8 md:px-0 md:ml-0 -ml-4 md:pl-0 text-gray-300">
                    {episode.summary}
                  </p>
                  {/* <div className="text-gray-300 font-expanded">
                  {episode.duration}
                </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default PodcastSeasonPage

const Providers = () => {
  return (
    <div className="flex sm:flex-row flex-col pb-16 gap-5 mx-auto justify-center max-w-screen-lg w-full px-5">
      <a
        href="https://open.spotify.com/show/01rZy6ri6RtVfyaWeLm0MR?si=f8ae4f3914c04372"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image src={SpotifyPodcasts} alt="" aria-hidden="true" />
        <span className="sr-only">Listen on Spotify</span>
      </a>
      <a
        href="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5zaW1wbGVjYXN0LmNvbS8wMGdSRURHUg"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image src={GooglePodcasts} alt="" aria-hidden="true" />
        <span className="sr-only">Listen on Google Podcasts</span>
      </a>
      <a
        href="https://podcasts.apple.com/cz/podcast/badass-courses/id1628629478"
        target="_blank"
        className="relative z-10 flex items-center justify-center border border-gray-700 px-2 py-1 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition rounded-lg"
        rel="noreferrer"
      >
        <Image src={ApplePodcasts} alt="" aria-hidden="true" />
        <span className="sr-only">Listen on Apple Podcasts</span>
      </a>
    </div>
  )
}

const Host = () => {
  return (
    <div className="flex items-center pt-12 gap-3">
      <div className="flex items-center justify-center rounded-full overflow-hidden">
        <Image src={Joel} alt="Joel Hooks" width={70} height={70} />
      </div>
      <div className="leading-none -space-y-3 flex flex-col items-baseline">
        {/* <span className="font-script text-xl">with</span> */}
        <div className="text-lg font-medium flex flex-col -space-y-4">
          <span className="font-script text-xl text-white/80 flex items-center">
            {/* <span className="font-symbol text-2xl">o</span> */}
            your host
          </span>

          <a
            href="https://twitter.com/jhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group relative"
          >
            <span>Joel Hooks</span>
            <span
              className="font-symbol text-4xl text-badass-yellow-300 group-hover:translate-x-1 transition"
              aria-hidden="true"
            >
              t
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
