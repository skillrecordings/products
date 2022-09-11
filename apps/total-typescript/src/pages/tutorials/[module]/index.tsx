import {SanityDocument} from '@sanity/client'
import {getTutorial} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import React from 'react'
import TutorialTemplate from 'templates/tutorial-template'

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const tutorial = await getTutorial(params?.module as string)
  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    props: {tutorial},
  }
}

const TutorialPage: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  return <TutorialTemplate tutorial={tutorial} />
}

export default TutorialPage
