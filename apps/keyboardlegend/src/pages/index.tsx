import * as React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {Signature, ThumbsUp, Grid1} from 'components/images'
import {PortableText} from '@portabletext/react'
import Bio from 'components/content/about-cassidy'
import {getPage} from 'lib/pages'
import PortableTextComponents from 'components/portable-text'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const HomePage: React.FC<{pageData: SanityDocument}> = ({pageData}) => {
  const {body} = pageData
  return (
    <>
      <Layout meta={{title: 'Keyboard Legend'}} className="bg-white-100">
        <Header />
        <main>
          <article className="prose sm:prose-lg lg:prose-xl max-w-[55ch] mx-auto px-5">
            <PortableText value={body} components={PortableTextComponents} />
            <Bio />
          </article>
          <section
            id="subscribe"
            className="max-w-screen-sm mx-auto w-full sm:pt-32 pt-20 sm:pb-24 pb-4 px-5"
          >
            <PrimaryNewsletterCta />
          </section>
        </main>
      </Layout>
    </>
  )
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async (req) => {
  const pageData = await getPage('/')

  return {
    props: {pageData},
  }
}

const Header = () => {
  return (
    <header className="overflow-hidden sm:px-16 px-5 bg-white min-h-[70vh] flex items-center">
      <div className="flex md:flex-row flex-col-reverse items-center justify-between max-w-[960px] w-full mx-auto">
        <h1 className="relative z-20 py-5">
          <div className="font-mono font-semibold uppercase pb-2">
            Learn how to build{' '}
            <span className="text-brand-pink-500">your own</span>
          </div>
          <div className="lg:text-6xl text-5xl font-bold uppercase">
            Mechanical
            <div className="text-brand-pink-500">Keyboard</div>
          </div>
          <div className="pt-2 space-x-2 flex items-center">
            <span className="font-mono text-xs uppercase">with</span>
            <Signature className="w-48" />
          </div>
        </h1>
        <div className="relative flex items-center justify-center sm:w-auto w-full ">
          <ThumbsUp className="w-96 p-10 relative z-10" />
          <Grid1 className="absolute -ml-8 top-20 text-brand-pink-100 w-[150%] opacity-80 z-0" />
        </div>
      </div>
    </header>
  )
}
