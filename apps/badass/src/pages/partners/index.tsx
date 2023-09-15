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
          <div className="mt-16 mb-28">
            <h2 className="text-3xl md:text-[2rem] lg:text-[2.5rem] leading-[1.2] text-center font-heading">
              More Projects
            </h2>
            <div className="mt-10 md:mt-16 lg:mt-20">
              <div className="grid md:grid-cols-2 gap-5">
                <Card
                  imageUrl="https://res.cloudinary.com/badass-courses/image/upload/v1692110114/cards-images/egghead_2x_eutdgv.png"
                  title="egghead.io"
                  subtitle="Joel Hooks & John Lindquist"
                  href="https://egghead.io/"
                  type="project"
                  ctaText="Visit Site"
                />
                <Card
                  imageUrl="https://res.cloudinary.com/badass-courses/image/upload/v1692110114/cards-images/testing-js_2x_ex7mli.png"
                  title="Testing Javascript"
                  subtitle="Kent C. Dodds"
                  href="https://testingjavascript.com/"
                  type="project"
                  ctaText="Visit Site"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <CallToActionForm content={genericCallToActionContent} />
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
