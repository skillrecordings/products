import {getOgImage} from 'utils/get-og-image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Layout from '../components/app/layout'

const NewsletterPage = () => {
  const title = 'TypeScript Newsletter by Matt Pocock'
  const ogImage = getOgImage({title})

  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="mx-auto w-full">
        <PrimaryNewsletterCta />
      </main>
    </Layout>
  )
}

export default NewsletterPage
