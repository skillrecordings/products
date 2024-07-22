import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import serializeMdx from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import {type CaseStudy, getAllCaseStudies, getCaseStudy} from 'lib/case-studies'
import CaseStudyTemplate from 'templates/case-study-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const caseStudy = await getCaseStudy(params?.slug as string)

  const caseStudyBodySerialized = await serializeMdx(caseStudy.markdownBody, {
    syntaxHighlighterOptions: {
      theme: 'one-dark-pro',
    },
  })
  if (!caseStudy) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      caseStudy,
      caseStudyBodySerialized,
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
  caseStudyBodySerialized: MDXRemoteSerializeResult
}

const CaseStudyPage: React.FC<React.PropsWithChildren<ArticlePageProps>> = ({
  caseStudy,
  caseStudyBodySerialized,
}) => {
  return (
    <CaseStudyTemplate
      caseStudy={caseStudy}
      caseStudyBodySerialized={caseStudyBodySerialized}
    />
  )
}

export default CaseStudyPage
