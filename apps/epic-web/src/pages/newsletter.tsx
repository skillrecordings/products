import Layout from 'components/app/layout'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const NewsletterPage = () => {
  const title = 'Follow Epic Web Dev'

  return (
    <Layout
      meta={{
        title,
        description:
          ' Get the latest tutorials, articles, and announcements delivered to your inbox.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1704809114/card-newsletter_2x.png',
        },
      }}
      className="bg-[radial-gradient(ellipse_at_top,#EAEBFF_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_65%)]"
    >
      <main className="mx-auto flex w-full flex-col items-center justify-center">
        <PrimaryNewsletterCta className="mt-40 bg-transparent" />
      </main>
    </Layout>
  )
}

export default NewsletterPage
