import Layout from 'components/app/layout'
import {getOgImage} from 'utils/get-og-image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const NewsletterPage = () => {
  const title = 'Newsletter Signup'
  const ogImage = getOgImage(title)
  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="bg-green-700 bg-noise text-white w-full mx-auto py-10 lg:pb-32 sm:pb-20">
        <h1 className="text-center font-extrabold lg:text-4xl sm:text-3xl text-2xl font-heading">
          {title}
        </h1>
        <div className="w-full">
          <PrimaryNewsletterCta />
        </div>
      </main>
    </Layout>
  )
}

export default NewsletterPage
