import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/layout'

const Answer: React.FC<{questionSet: QuestionSet}> = ({questionSet}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <header className="flex w-full items-center justify-center pt-5 pb-5 sm:pt-16 sm:pb-0">
        <div className="w-40 sm:w-auto">
          <Image />
        </div>
      </header>
      <div className="flex h-full w-full flex-col items-center justify-center sm:py-16">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig({
            title: process.env.NEXT_PUBLIC_SITE_TITLE,
            instructor: process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME,
          })}
        />
      </div>
    </Layout>
  )
}

const Image = () => {
  return null
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props

  const questionSet: QuestionSet = {}
  return {
    props: {questionSet},
  }
}

export default Answer
