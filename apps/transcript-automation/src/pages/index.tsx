import Layout from 'components/layout'
import type {NextPage} from 'next'
import {PrimaryNewsletterCta} from '../components/primary-newsletter-cta'
import HomeCopy from 'content/home.md'

const Home: NextPage = () => {
  return (
    <Layout className="p-3">
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow pt-16">
        Transcript Automation Using AI Tools 😎
      </h1>
      <article className="prose prose-lg w-full mx-auto pt-16">
        <HomeCopy />
      </article>
      <section className="w-full mx-auto">
        <PrimaryNewsletterCta />
      </section>
    </Layout>
  )
}

export default Home
