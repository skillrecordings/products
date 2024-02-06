import * as React from 'react'

import {type CaseStudy} from 'lib/case-studies'
import ContentSection from 'components/content-section'
import Card from 'components/card'

type CaseStudiesProps = {
  caseStudies: CaseStudy[]
}

const CaseStudies: React.FC<CaseStudiesProps> = ({caseStudies}) => {
  return (
    <ContentSection
      title="badass case studies"
      subtitle="A Deep Dive into our Processes"
    >
      <div className="grid md:grid-cols-2 w-full gap-4 mt-8 lg:mt-[4.5rem]">
        {caseStudies.map((caseStudy) => {
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
