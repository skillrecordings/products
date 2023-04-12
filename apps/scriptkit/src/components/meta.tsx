import Head from 'next/head'
import {useRouter} from 'next/router'
import qs from 'query-string'

interface MetaProps {
  author?: string
  user?: string
  title: string
  twitter?: string
  description?: string
  backgroundImage?: string
}

export default function Meta(props: MetaProps) {
  const query = {
    ...props,
    backgroundImage: `https://scriptkit.com/card-background.png`,
  }

  const {user, title, twitter = 'johnlindquist', description} = query

  const router = useRouter()

  let opengraphImage = `${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api/cloudinary-cache?${qs.stringify(query)}`

  if (!opengraphImage.startsWith('http'))
    opengraphImage = `https://${opengraphImage}`

  let url = `${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`
  if (!url.startsWith('http')) url = `https://${url}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={opengraphImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`@${twitter}`} />
      <meta name="twitter:creator" content={`@${twitter}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={opengraphImage} />
    </Head>
  )
}
