import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from 'components/landing-copy.mdx'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="mx-auto flex w-full max-w-screen-lg items-center justify-center text-center">
        <h1 className="py-24 text-6xl font-bold">Hi! 👋</h1>
      </header>
      <main>
        <article className="prose mx-auto w-full max-w-2xl sm:prose-lg">
          <LandingCopy />
        </article>
        <PrimaryNewsletterCta className="pt-20" />
      </main>
    </Layout>
  )
}

export default Home
