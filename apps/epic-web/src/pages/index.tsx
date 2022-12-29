import React from 'react'
import Layout from 'components/app/layout'
import {getPage} from 'lib/pages'
import type {NextPage} from 'next'
import {useReducedMotion, motion} from 'framer-motion'
import {PortableText} from '@portabletext/react'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/about-kent'
import Starfield from 'components/starfield'
import {useConvertkit} from '@skillrecordings/convertkit-react-ui'
import {track} from 'utils/analytics'

export async function getStaticProps() {
  const page = await getPage('/')

  return {
    props: {page},
    revalidate: 10,
  }
}

const Index: NextPage<any> = ({page}) => {
  const [starfieldSpeed, setStarfieldSpeed] = React.useState(0.5)
  const {body} = page
  const {subscriber} = useConvertkit()

  return (
    <Layout>
      <Header />
      <main className="sm:pb-48 pb-24">
        <Article body={body} />
        <Subscribe
          subscriber={subscriber}
          setStarfieldSpeed={setStarfieldSpeed}
        />
        <AboutKent />
      </main>
      <Starfield speed={starfieldSpeed} />
    </Layout>
  )
}

const Article: React.FC<{body: any}> = ({body}) => {
  return (
    <article className="px-5 prose max-w-none prose-p:mx-auto md:prose-xl xl:prose-h2:mt-0 sm:prose-lg prose-p:max-w-2xl mx-auto sm:prose-p:py-2 prose-headings:text-center prose-headings:py-16 xl:prose-headings:fluid-2xl xl:prose-h3:text-3xl prose-h3:pt-0 prose-h3:pb-4 prose-h3:max-w-2xl prose-h3:mx-auto prose-h3:text-left sm:prose-h3:text-2xl prose-h3:text-xl">
      <PortableText value={body} />
    </article>
  )
}

const Header = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="min-h-[70vh] flex items-center justify-center py-32">
      <div className="text-center mx-auto">
        <h1 className="fluid-3xl lg:w-[35ch] lg:px-16 px-5 font-bold leading-tight">
          Everything You Need to Know to Ship{' '}
          <motion.span className="relative">
            Modern Full-Stack
            <motion.div
              animate={shouldReduceMotion ? {} : {width: ['0%', '100%']}}
              transition={{
                delay: 0.5,
                type: 'spring',
                duration: 1,
              }}
              initial={{width: shouldReduceMotion ? '100%' : '0%'}}
              className="h-px bg-amber-200 w-full absolute bottom-0 left-0 lg:inline-block hidden"
            />
          </motion.span>{' '}
          Web Applications
        </h1>
      </div>
    </header>
  )
}

type SubscribeProps = {
  subscriber: any
  setStarfieldSpeed: (speed: number) => void
}

const Subscribe: React.FC<SubscribeProps> = ({
  subscriber,
  setStarfieldSpeed,
}) => {
  return (
    <section
      aria-label="Newsletter sign-up"
      className="pt-10 sm:pb-48 pb-24"
      id="primary-newsletter-cta"
    >
      {!subscriber ? (
        <PrimaryNewsletterCta
          setStarfieldSpeed={setStarfieldSpeed}
          onSubmit={() => {
            track('subscribed from landing page')
          }}
        />
      ) : (
        <div className="lg:text-4xl sm:text-3xl text-2xl font-bold text-center">
          You're subscribed{' '}
          <span aria-hidden="true" className="text-brand">
            ✧
          </span>{' '}
          Thanks!
        </div>
      )}
    </section>
  )
}

export default Index
