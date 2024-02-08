import * as React from 'react'
import {GetStaticProps} from 'next'
import Image from 'next/legacy/image'
import {motion} from 'framer-motion'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {type Podcast, getAllPodcastEpisodes} from 'lib/podcast'
import {type Article, getAllArticles} from 'lib/articles'

import Layout from 'components/layout'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {ButtonPrimary, ButtonSecondary} from 'components/buttons'
import CaseStudies from 'components/landing/case-studies'
import Podcasts from 'components/landing/podcasts'

import 'keen-slider/keen-slider.min.css'

type ConfirmationPageProps = {
  caseStudies: CaseStudy[]
  podcasts: Podcast[]
  articles: Article[]
}

type ArticlesProps = {
  articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
  const latestArticles = articles
    .sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
    )
    .slice(0, 2)
  return (
    <ContentSection
      title="Badass Articles"
      subtitle="Our Key Lessons Learned Along the Way"
      subtitleClassName="md:max-w-[450px] lg:max-w-[500px] xl:max-w-none"
      renderAdditionalComponent={() => (
        <>
          <ButtonSecondary href="/articles" size="small" className="lg:hidden">
            View All Articles
          </ButtonSecondary>
          <ButtonSecondary
            href="/articles"
            size="middle"
            className="hidden lg:inline-flex"
          >
            View All Articles
          </ButtonSecondary>
        </>
      )}
    >
      <div className="mt-6 md:mt-10 lg:mt-20 gap-y-2 md:gap-y-0 md:gap-x-4 lg:gap-x-16 flex flex-col md:flex-row items-center">
        <div className="grid md:grid-cols-2 gap-4">
          {latestArticles.map((article) => {
            console.log({image: article.image})
            return (
              <Card
                key={article._id}
                imageUrl={article.externalImage}
                title={article.title}
                description={article.description}
                href={`/${article.slug}`}
                type="article"
                ctaText="View"
                authorName="Joel Hooks"
                authorAvatarUrl="/joel-hooks.jpg"
                featuredCardColor={article.card_color}
              />
            )
          })}
        </div>
      </div>
    </ContentSection>
  )
}

const DontMissUpdates = () => {
  return (
    <section>
      <div className="container">
        <div className="w-full flex flex-col-reverse items-center md:flex-row rounded-2xl bg-badass-neutral-900 px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-28 relative">
          <div className="md:w-1/2 flex flex-col items-center text-center md:text-left md:items-start space-y-8  md:py-12 lg:py-20 xl:py-24 pb-6 md:pb-0">
            <h3 className="text-white text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.2] font-heading">
              Don’t miss out on latest updates
            </h3>
            <ButtonPrimary
              href="https://twitter.com/badass_courses"
              className="min-w-0 px-10 lg:px-16 bg-badass-cyan-600 whitespace-nowrap"
            >
              Follow us on twitter
            </ButtonPrimary>
          </div>
          <div className="md:w-1/2 flex items-center justify-center md:justify-end">
            <div className="w-2/3 md:w-full md:max-w-[300px] lg:max-w-[400px] xl:max-w-[480px] md:absolute bottom-0">
              <Image
                src="https://res.cloudinary.com/badass-courses/image/upload/v1707417336/assets/sign-up-confirmation-page/dont-miss-out-on-latest-updates_djfkwn.png"
                width={480}
                height={480}
                alt="Don’t miss out on latest updates"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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
          className="max-w-3xl text-xl leading-[1.75] mt-2 text-badass-gray-300 text-center font-medium"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring', delay: 0.1}}
        >
          We're working on some badass stuff and you’ll be the first to know. In
          the meantime, check out our podcast, articles or learn about how we do
          things here at badass.dev in our honest case studies.
        </motion.p>
      </div>
      <div className="mt-28 md:mt-36 lg:mt-40 xl:mt-48 space-y-24 md:space-y-32 lg:space-y-36 xl:space-y-40 pb-12 md:pb-16 xl:pb-24">
        <Articles articles={articles} />
        <CaseStudies caseStudies={caseStudies} maxItems={2} />
        <Podcasts podcasts={podcasts} />
        <DontMissUpdates />
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
