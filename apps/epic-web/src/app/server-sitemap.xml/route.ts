import {getServerSideSitemap} from 'next-sitemap'

export async function GET() {
  // const articles = await getAllArticles()

  return getServerSideSitemap([
    // ...articles.map((article: any) => ({
    //   loc: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`,
    //   lastmod: new Date(article.date).toISOString(),
    //   changefreq: 'weekly',
    //   priority: 0.7,
    // })),
  ])
}
