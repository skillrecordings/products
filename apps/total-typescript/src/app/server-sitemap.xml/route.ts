import {getServerSideSitemap} from 'next-sitemap'

export async function GET() {
  return getServerSideSitemap([])
}
