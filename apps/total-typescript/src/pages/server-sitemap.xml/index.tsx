import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllTutorials} from '../../lib/tutorials'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const tutorials = await getAllTutorials()
  const tutorialSitemap = tutorials.flatMap((tutorial: any) => {
    const tutorialRootUrl = `${process.env.NEXT_PUBLIC_URL}/tutorials/${tutorial.slug.current}`
    return [
      {
        loc: tutorialRootUrl, // Absolute url
        lastmod: new Date(tutorial._updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
      ...tutorial.exercises.map((exercise: any) => {
        return {
          //exercises
          loc: `${tutorialRootUrl}/${exercise.slug.current}`, // Absolute url
          lastmod: new Date(exercise._updatedAt).toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        }
      }),
      ...tutorial.exercises.map((exercise: any) => {
        return {
          //solutions
          loc: `${tutorialRootUrl}/${exercise.slug.current}/solution`, // Absolute url
          lastmod: new Date(exercise._updatedAt).toISOString(),
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
