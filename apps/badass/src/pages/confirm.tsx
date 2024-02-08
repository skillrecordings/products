import * as React from 'react'
import {GetStaticProps} from 'next'
import Image from 'next/legacy/image'
import {motion} from 'framer-motion'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {type Podcast, getAllPodcastEpisodes} from 'lib/podcast'
import {type Article, getAllArticles} from 'lib/articles'

import Layout from 'components/layout'
import CaseStudies from 'components/landing/case-studies'
import Podcasts from 'components/landing/podcasts'

import 'keen-slider/keen-slider.min.css'

type ConfirmationPageProps = {
  caseStudies: CaseStudy[]
  podcasts: Podcast[]
  articles: Article[]
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  caseStudies,
  podcasts,
  articles,
}) => {
  return (
    <Layout
      className="p-0 min-h-[calc(100vh-96px)] flex flex-col"
      meta={{title: 'Confirm your subscription'}}
    >
      <div className="container grow flex-col items-center flex pt-8">
        <Image
          src="https://res.cloudinary.com/badass-courses/image/upload/v1707406044/assets/sign-up-confirmation-page/success-signing-up_cab77v.png"
          width={520}
          height={520}
          alt="friendly computer with smiley face on the screen"
          priority
        />
        <motion.h2
          className="font-condensed text-[1.75rem] pt-8 pb-6 text-badass-green-500"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring'}}
        >
          Success! Thank you for signing up
        </motion.h2>
        <motion.p
          className="max-w-3xl text-xl leading-[1.75] mt-2 text-badass-gray-300 text-center"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring', delay: 0.1}}
        >
          We're working on some badass stuff and you’ll be the first to know. In
          the meantime, check out our podcast, articles or learn about how we do
          things here at badass.dev in our honest case studies.
        </motion.p>
      </div>
      <div className="mt-48 space-y-40">
        <CaseStudies caseStudies={caseStudies} maxItems={2} />
        <Podcasts podcasts={podcasts} />
      </div>
    </Layout>
  )
}

export default ConfirmationPage

export const getStaticProps: GetStaticProps = async () => {
  const caseStudies = await getAllCaseStudies()
  const podcasts = await getAllPodcastEpisodes()
  const articles = await getAllArticles()

  return {
    props: {
      caseStudies,
      podcasts,
      articles,
    },
    revalidate: 10,
  }
}
