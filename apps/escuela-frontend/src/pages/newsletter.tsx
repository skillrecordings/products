import Layout from 'components/layout'

import SubscribeForm from 'components/subscribe-form'

const NewsletterPage = () => {
  const title = 'Newsletter'

  return (
    <Layout meta={{title}} className="w-full">
      <main className="mx-auto w-full">
        <SubscribeForm />
      </main>
    </Layout>
  )
}

export default NewsletterPage
