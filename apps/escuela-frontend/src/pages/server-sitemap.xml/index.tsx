import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllArticles} from 'lib/articles'
import {getAllTips} from 'lib/tips'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  // load content that we want to add to the sitemap here
  const articles = await getAllArticles()
  const tips = await getAllTips()

  return getServerSideSitemap(ctx, [
    ...articles.map((article: any) => {
      return {
        loc: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`, // Absolute url
        lastmod: new Date(article.date).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    }),
    ...tips.map((tip: any) => {
      return {
        loc: `${process.env.NEXT_PUBLIC_URL}/tips/${tip.slug}`, // Absolute url
        lastmod: new Date(tip._updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    }),
  ])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
