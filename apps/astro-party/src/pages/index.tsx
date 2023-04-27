import React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import Balancer from 'react-wrap-balancer'
import LandingCopy from 'components/landing-copy.mdx'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import {motion} from 'framer-motion'
import {useAnimatedColor} from 'hooks/use-animated-color'

const Home: NextPage = () => {
  const animatedColor = useAnimatedColor()

  return (
    <Layout
      withFooter={false}
      navigationProps={{
        className: 'absolute px-20 top-10 w-full max-w-none text-white',
      }}
    >
      <motion.div
        style={
          {
            // backgroundColor: animatedColor,
          }
        }
        animate={{
          backgroundColor: [
            '#F45328',
            '#ED5C75',
            '#D541EF',
            '#16A0D0',
            '#06AE59',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          type: 'linear',
        }}
      >
        <motion.header className="mx-auto flex w-full flex-grow items-center justify-center rounded-lg pb-32 pt-72 text-center text-white">
          <h1 className="max-w-4xl font-heading text-7xl font-extrabold">
            <Balancer>
              Learn to Develop Fast and Modern Websites with Astro
            </Balancer>
          </h1>
        </motion.header>
        <main className="">
          <div className="mx-auto w-full max-w-4xl rounded-full border-4 border-black bg-white px-24 py-80">
            <article
              className={`prose prose-lg mx-auto w-full max-w-3xl font-heading sm:prose-xl first-letter:float-left first-letter:pr-3 first-letter:text-7xl first-letter:font-bold prose-p:font-normal prose-p:text-black`}
            >
              <LandingCopy />
            </article>
          </div>
          <PrimaryNewsletterCta className="py-40">
            <h2 className="max-w-4xl pb-20 text-center font-heading text-6xl font-bold text-white">
              <Balancer>
                Get the latest Astro news, tutorials, and updates delivered to
                your inbox.
              </Balancer>
            </h2>
          </PrimaryNewsletterCta>
        </main>
      </motion.div>
    </Layout>
  )
}

export default Home
