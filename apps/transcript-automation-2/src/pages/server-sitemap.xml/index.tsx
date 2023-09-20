import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  // const articles = await getAllArticles()

  return getServerSideSitemap(ctx, [
    // ...articles.map((article: any) => {
    //   return {
    //     loc: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`, // Absolute url
    //     lastmod: new Date(article.date).toISOString(),
    //     changefreq: 'weekly',
    //     priority: 0.7,
    //   }
    // }),
  ])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
