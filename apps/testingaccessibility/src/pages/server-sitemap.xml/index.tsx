import {getServerSideSitemap, getServerSideSitemapIndex} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllArticles} from '../../lib/articles'
import {getAllReviews} from '../../lib/reviews'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  // load content that we want to add to the sitemap here
  const articles = await getAllArticles()
  const reviews = await getAllReviews()

  console.log({reviews})

  return getServerSideSitemap(ctx, [
    ...articles.map((article: any) => {
      return {
        loc: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`, // Absolute url
        lastmod: new Date(article.date).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    }),
    ...reviews.map((review: any) => {
      return {
        loc: `${process.env.NEXT_PUBLIC_URL}/accessibility-reviews/${review.slug}`, // Absolute url
        lastmod: new Date(review.date).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    }),
  ])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
