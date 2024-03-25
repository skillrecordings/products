import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import Livestream from '@/components/livestream'
import livestreams from '@/content/livestreams'

const LivestreamsPage = () => {
  const [hasMounted, setMounted] = React.useState(false)
  const title = 'Livestreams Schedule'
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return hasMounted ? (
    <Layout
      meta={{
        title,
        description:
          'strap in and take your React applications to the next level',
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}/og-images/livestreams@2x.png` as string,
          alt: title,
        },
      }}
    >
      <main className="mx-auto grid w-full max-w-screen-md grid-cols-1 gap-5 px-5 pb-24 pt-12 sm:pt-14">
        <div className="mx-auto w-48">
          <Image
            src="/assets/satellite.png"
            width={384}
            height={384}
            alt="livestreams schedule"
            priority
          />
        </div>
        <h1 className="text-center text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Epic Livestreams
        </h1>
        <Divider className="mb-5 sm:mb-8" />
        <div>
          <h2 className="border-b border-er-gray-200 pb-3 text-sm font-semibold uppercase tracking-wider">
            ↓ Past
          </h2>
          {livestreams.map((livestream) => {
            return <Livestream key={livestream.startDatetime} {...livestream} />
          })}
        </div>
      </main>
    </Layout>
  ) : null
}

export default LivestreamsPage
