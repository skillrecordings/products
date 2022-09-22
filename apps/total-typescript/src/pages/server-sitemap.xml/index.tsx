import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return getServerSideSitemap(ctx, [])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
