import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {type CaseStudy, getAllCaseStudies, getCaseStudy} from 'lib/case-studies'
import CaseStudyTemplate from 'templates/case-study-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const caseStudy = await getCaseStudy(params?.slug as string)

  return {
    props: {
      caseStudy,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const allCaseStudies = await getAllCaseStudies()

  const paths = allCaseStudies.map((caseStudy: any) => {
    return {
      params: {
        slug: caseStudy.slug,
      },
    }
  })
  return {paths, fallback: 'blocking'}
}

type ArticlePageProps = {
  caseStudy: CaseStudy
}

const CaseStudyPage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  caseStudy,
}) => {
  return <CaseStudyTemplate caseStudy={caseStudy} />
}

export default CaseStudyPage
