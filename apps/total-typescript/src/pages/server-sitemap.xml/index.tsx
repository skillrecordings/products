import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllTips} from 'lib/tips'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const tutorialSitemap: any[] = []

  const tips = await getAllTips()
  const tipsSitemap = tips.flatMap((tip: any) => {
    const tipRootUrl = `${process.env.NEXT_PUBLIC_URL}/tips/${tip.slug.current}`
    return [
      {
        loc: tipRootUrl, // Absolute url
        lastmod: new Date(tip._updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
    ]
  })
  return getServerSideSitemap(ctx, [...tutorialSitemap, ...tipsSitemap])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
