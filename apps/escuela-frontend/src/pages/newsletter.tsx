import Layout from 'components/layout'
import {getOgImage} from 'utils/get-og-image'
import SubscribeForm from 'components/subscribe-form'

const NewsletterPage = () => {
  const title = 'Newsletter'
  const ogImage = getOgImage(title)

  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="mx-auto w-full">
        <SubscribeForm />
      </main>
    </Layout>
  )
}

export default NewsletterPage
