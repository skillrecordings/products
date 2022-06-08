import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getPodcast, getPodcastSeason, PodcastSeason} from '../../../lib/podcast'
import Layout from '../../../components/layout'
import Link from 'next/link'
import {Grid} from '../../../components/grid'
import * as dateFns from 'date-fns'
import {TriangleIcon} from '../../../components/icons/triangle-icon'

function formatTime(seconds: number) {
  return dateFns.format(dateFns.addSeconds(new Date(0), seconds), 'mm:ss')
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  if (params?.podcastSeason) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    const season = await getPodcastSeason(params.podcastSeason as string)
    if (season) {
      return {
        props: {
          season,
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

const PodcastSeason: React.FC<{season: PodcastSeason}> = ({season}) => {
  return (
    <Layout className="p-5 flex flex-col mx-auto">
      <h1 className="text-2xl font-bold">Podcast Season One: {season.title}</h1>
      <p className="">
        Season One of the Badass Courses podcast focuses on independent course
        creators that have built an audience, designed a course, and launched
        their courses on their own terms and often on their own platforms.
      </p>
      <h2 className="text-xl">Episodes</h2>
      {season.episodes.map((episode, index) => (
        <Link
          key={episode.slug}
          href={`/podcast/${season.slug}/${episode.slug}`}
        >
          <a className="group focus:outline-none">
            <Grid
              nested
              className="relative border-b border-gray-200 py-10 dark:border-gray-600 lg:py-5"
            >
              <div className="bg-secondary absolute -inset-px -mx-6 hidden rounded-lg group-hover:block group-focus:block" />

              <div className="relative col-span-1 flex-none">
                <div className="absolute inset-0 flex scale-0 transform items-center justify-center opacity-0 transition group-hover:scale-100 group-hover:opacity-100 group-focus:opacity-100">
                  <div className="flex-none rounded-full bg-white p-4 text-gray-800">
                    <TriangleIcon />
                  </div>
                </div>
                <img
                  className="h-18 w-full rounded-lg object-cover"
                  src={episode.coverArtUrl}
                  alt={episode.title}
                />
              </div>
              <div className="text-primary relative col-span-3 flex flex-col md:col-span-7 lg:col-span-11 lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-3 text-xl font-medium lg:mb-0">
                  <span className="inline-block w-10 lg:text-lg">
                    {`${(index + 1).toString().padStart(2, '0')}.`}
                  </span>
                  {episode.title}
                </div>
                <div className="text-lg font-medium text-gray-400">
                  {episode.duration}
                </div>
              </div>
            </Grid>
          </a>
        </Link>
      ))}
    </Layout>
  )
}

export default PodcastSeason
