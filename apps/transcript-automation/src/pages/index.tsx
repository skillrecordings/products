import Layout from 'components/layout'
import type {NextPage} from 'next'
import {PrimaryNewsletterCta} from '../components/primary-newsletter-cta'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow">
        Transcript Automation Using AI Tools 😎
      </h1>
      <main className="w-full mx-auto">
        <PrimaryNewsletterCta />
      </main>
    </Layout>
  )
}

export default Home
