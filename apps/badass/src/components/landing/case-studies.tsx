import * as React from 'react'

import {type CaseStudy} from 'lib/case-studies'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {ButtonSecondary} from 'components/buttons'

type CaseStudiesProps = {
  caseStudies: CaseStudy[]
  maxItems?: number
}

const CaseStudies: React.FC<CaseStudiesProps> = ({
  caseStudies,
  maxItems = 4,
}) => {
  return (
    <ContentSection
      title="badass case studies"
      subtitle="A Deep Dive into our Processes"
      renderAdditionalComponent={() => (
        <>
          <ButtonSecondary href="/partners" size="small" className="lg:hidden">
            View All Case Studies
          </ButtonSecondary>
          <ButtonSecondary
            href="/partners"
            size="middle"
            className="hidden lg:inline-flex"
          >
            View All Case Studies
          </ButtonSecondary>
        </>
      )}
    >
      <div className="grid md:grid-cols-2 w-full gap-4 mt-8 lg:mt-[4.5rem]">
        {caseStudies.slice(0, maxItems).map((caseStudy) => {
          return (
            <Card
              key={caseStudy._id}
              imageUrl={caseStudy.cardImage}
              title={caseStudy.title}
              subtitle={caseStudy.partnerName}
              href={`/partners/${caseStudy.slug}`}
              type="caseStudy"
              ctaText="Read Case Study"
            />
          )
        })}
      </div>
    </ContentSection>
  )
}

export default CaseStudies
