import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getPodcast, getPodcastSeason, PodcastSeason} from '../../../lib/podcast'

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

const PodcastSeason: React.FC<{season: PodcastSeason}> = ({season}) => {
  return (
    <div>
      <h1>{season.title}</h1>
      <h2>Episodes</h2>
      <ul>
        {season.episodes.map((episode) => (
          <li key={episode.slug}>
            <a href={`/podcast/${season.slug}/${episode.slug}`}>
              {episode.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PodcastSeason
