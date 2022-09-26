import {getServerSideSitemap, getServerSideSitemapIndex} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllArticles} from '../../lib/articles'
import {getPodcastSeason} from '../../lib/podcast'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const podcastSeason = 'course-builders'

  // load content that we want to add to the sitemap here
  // const articles = await getAllArticles()
  // const podcast = await getPodcastSeason(podcastSeason)

  return getServerSideSitemap(ctx, [])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
