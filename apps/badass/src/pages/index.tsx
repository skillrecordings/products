import * as React from 'react'
import {GetStaticProps} from 'next'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {type Podcast, getAllPodcastEpisodes} from 'lib/podcast'
import {type Article, getAllArticles} from 'lib/articles'

import Layout from 'components/layout'
import {
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'
import {CallToActionForm} from 'components/call-to-action-form'
import Header from 'components/landing/header'
import SecretSauce from 'components/landing/secret-sauce'
import CaseStudies from 'components/landing/case-studies'
import OtherProducts from 'components/landing/other-products'
import Podcasts from 'components/landing/podcasts'
import Articles from 'components/landing/articles'
import {CourseBuilderTeaser} from 'components/course-builder/course-builder-teaser'

type LandingPageProps = {
  caseStudies: CaseStudy[]
  podcasts: Podcast[]
  articles: Article[]
}

const LandingPage: React.FC<LandingPageProps> = ({
  caseStudies,
  podcasts,
  articles,
}) => {
  return (
    <Layout className="overflow-hidden">
      <Header content={headerContent} />
      <main>
        <SecretSauce content={secretSauceContent} />
        <section className="flex flex-col items-center justify-center py-16 mt-14 md:mt-0 md:pt-1 lg:pt-14">
          <CaseStudies caseStudies={caseStudies} />
          <OtherProducts />
          <CourseBuilderTeaser />
          <Podcasts podcasts={podcasts} className="mt-20" />
          <Articles
            articles={articles}
            className="mt-14 md:mt-[60px] lg:mt-36"
          />
        </section>
        <CallToActionForm content={genericCallToActionContent} />
      </main>
    </Layout>
  )
}

export default LandingPage

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
