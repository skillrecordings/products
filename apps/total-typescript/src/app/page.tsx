import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {headers, cookies} from 'next/headers'
import {NextRequest} from 'next/server'
import {HomeTemplate} from '../templates/home-template'
import {getPricing} from '@/lib/pricing'

export default async function Page({searchParams}: {searchParams: Record<string, string | string[] | undefined>}) {
  const req = new NextRequest('http://example.com', {
    headers: headers(),
    cookies: cookies(),
  })

  const token = await getToken({req})
  const pricing = await getPricing('primary')
  const products = pricing?.products
  const {props} = await propsForCommerce({
    query: searchParams,
    token,
    products: products as any,
  })

  return <HomeTemplate {...props} />
}
