import Layout from 'components/layout'
import {getOgImage} from 'utils/get-og-image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const NewsletterPage = () => {
  const title = 'Newsletter'
  const ogImage = getOgImage(title)

  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="mx-auto w-full">
        <PrimaryNewsletterCta />
      </main>
    </Layout>
  )
}

export default NewsletterPage
