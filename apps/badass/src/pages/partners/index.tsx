import * as React from 'react'
import Layout from 'components/layout'
import {GetStaticProps} from 'next'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {CallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from 'components/landing-content'
import Card from 'components/card'
import TitleWithStars from 'components/title-with-stars'

const meta = {
  title: 'Badass Partners',
  ogImage: {
    url: 'https://badass.dev/card@2x.png',
  },
}

type CaseStudiesProps = {
  caseStudies: CaseStudy[]
}

const CaseStudies: React.FC<React.PropsWithChildren<CaseStudiesProps>> = ({
  caseStudies,
}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <div className="container mt-6 md:mt-8 lg:mt-11">
        <main>
          <TitleWithStars>Case Studies</TitleWithStars>
          <div className="mt-8 md:mt-16 lg:mt-[87px] pb-[100px]">
            <div className="space-y-10">
              {caseStudies.map((caseStudy, i: number) => {
                return (
                  <Card
                    key={caseStudy._id}
                    imageUrl={caseStudy.heroImage}
                    title={caseStudy.title}
                    subtitle={caseStudy.partnerName}
                    href={`/partners/${caseStudy.slug}`}
                    type="caseStudy"
                    horizontalOrientation={true}
                    ctaText="Read Case Study"
                    publishedDate={caseStudy.publishedDate}
                    isEven={(i + 1) % 2 === 0}
                  />
                )
              })}
            </div>
          </div>
          <CallToActionForm content={genericCallToActionContent} />
        </main>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const caseStudies = await getAllCaseStudies()

  return {
    props: {
      caseStudies,
    },
    revalidate: 10,
  }
}

export default CaseStudies
