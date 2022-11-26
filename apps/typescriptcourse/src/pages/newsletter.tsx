import React from 'react'
import Newsletter from 'components/newsletter'
import Layout from 'components/app/layout'
import {useConvertkit} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'

function NewsletterPage() {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const title = 'TypeScript Course Newsletter'

  const ogImage = getOgImage(title)
  const shortDescription = 'newsletter page'
  const router = useRouter()

  return (
    <Layout
      className="relative"
      meta={{
        ogImage,
        title: 'TypeScript Course Newsletter',
        description: shortDescription,
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <main className="mb-36">
        <Newsletter
          subscriber={subscriber}
          loadingSubscriber={loadingSubscriber}
          cta
        />
      </main>
    </Layout>
  )
}

export default NewsletterPage
