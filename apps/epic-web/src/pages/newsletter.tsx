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
    >
      <main className="mx-auto flex w-full flex-col items-center justify-center">
        <PrimaryNewsletterCta className="bg-transparent" />
      </main>
    </Layout>
  )
}

export default NewsletterPage
