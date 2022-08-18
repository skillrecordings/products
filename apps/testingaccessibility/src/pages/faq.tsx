import Layout from 'components/app/layout'
import FAQ from 'components/content/faq-section'
import {getOgImage} from 'utils/get-og-image'

const FAQPage = () => {
  const title = 'Frequently Asked Questions'
  const ogImage = getOgImage({title})
  return (
    <Layout meta={{title, ogImage}}>
      <main className="max-w-screen-lg w-full mx-auto py-10 lg:pb-32 sm:pb-20">
        <h1 className="text-center px-8 sm:pb-24 pb-16 sm:pt-10 pt-5 font-extrabold lg:text-4xl sm:text-3xl text-2xl font-heading">
          {title}
        </h1>
        <FAQ />
      </main>
    </Layout>
  )
}

export default FAQPage
