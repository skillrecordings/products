import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getPodcast, Podcast} from '../../lib/podcast'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const podcast = await getPodcast('badass-courses')
  return {
    props: {
      podcast,
    },
  }
}

const Podcast: React.FC<{podcast: Podcast}> = ({podcast}) => {
  return (
    <div>
      <h1>{podcast.title}</h1>
      <ul>
        {podcast.seasons.map((season) => (
          <li key={season.slug}>
            <a href={`/podcast/${season.slug}`}>
              <h2>{season.title}</h2>
            </a>
            <h3>Episodes:</h3>
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.slug}>
                  <a href={`/podcast/${season.slug}/${episode.slug}`}>
                    {episode.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Podcast
