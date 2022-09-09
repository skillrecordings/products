import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllTutorials} from '../../lib/tutorials'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const tutorials = await getAllTutorials()
  const tutorialSitemap = tutorials.flatMap((tutorial: any) => {
    const tutorialRootUrl = `${process.env.NEXT_PUBLIC_URL}/tutorials/${tutorial.slug}`
    return [
      {
        loc: tutorialRootUrl, // Absolute url
        lastmod: new Date(tutorial._updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
      ...tutorial.resources.map((section: any) => {
        return {
          //exercises
          loc: `${tutorialRootUrl}/${section.slug.current}`, // Absolute url
          lastmod: new Date(section._updatedAt).toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        }
      }),
      ...tutorial.resources.map((section: any) => {
        return {
          //solutions
          loc: `${tutorialRootUrl}/${section.slug.current}-solution`, // Absolute url
          lastmod: new Date(section._updatedAt).toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        }
      }),
    ]
  })
  return getServerSideSitemap(ctx, [...tutorialSitemap])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
