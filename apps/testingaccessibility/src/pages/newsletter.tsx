import Layout from 'components/app/layout'
import {getOgImage} from 'utils/get-og-image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const NewsletterPage = () => {
  const title = 'Newsletter'
  const ogImage = getOgImage(title)

  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="bg-green-700 bg-noise text-white w-full mx-auto">
        <PrimaryNewsletterCta>
          <h1 className="max-w-xl font-heading mx-auto -mt-4 sm:text-4xl text-3xl leading-none text-center md:text-5xl font-bold sm:mt-0">
            Join my exclusive, free{' '}
            <span className="whitespace-nowrap">6-part</span> email course
          </h1>
          <h2 className="max-w-md leading-tight pt-6 pb-16 text-xl text-center text-orange-200">
            And learn more about building and testing accessible web
            applications.
          </h2>
        </PrimaryNewsletterCta>
      </main>
    </Layout>
  )
}

export default NewsletterPage
