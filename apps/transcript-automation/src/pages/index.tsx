import Layout from '@/components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from '@/components/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
          <Balancer>Transcript Automation Using AI Tools 😎</Balancer>
        </h1>
        <h2 className="pt-8 text-lg font-semibold sm:text-xl lg:text-2xl">
          <Balancer>Boost your Output 500%</Balancer>
        </h2>
      </header>
      <main>
        <article className="prose mx-auto w-full max-w-2xl px-3 sm:prose-lg">
          <LandingCopy />
        </article>
        <PrimaryNewsletterCta className="py-20" />
      </main>
    </Layout>
  )
}

export default Home
