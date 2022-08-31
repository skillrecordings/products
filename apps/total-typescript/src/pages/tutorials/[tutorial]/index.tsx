import {SanityDocument} from '@sanity/client'
import {getTutorial} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import React from 'react'
import TutorialTemplate from 'templates/tutorial-template'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const tutorial = await getTutorial(params?.tutorial as string)
  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  return {
    props: {tutorial},
  }
}

const TutorialPage: React.FC<{tutorial: SanityDocument}> = ({tutorial}) => {
  return <TutorialTemplate tutorial={tutorial} />
}

export default TutorialPage
