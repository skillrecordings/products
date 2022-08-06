import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/app/layout'

const Answer: React.FC<{questionSet: QuestionSet}> = ({questionSet}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <header className="flex items-center justify-center w-full sm:pt-16 sm:pb-0 pt-5 pb-5">
        <div className="sm:w-auto w-40">
          <Image />
        </div>
      </header>
      <div className="h-full w-full flex flex-col items-center justify-center sm:py-16">
        <QuizAnswerPage questionSet={questionSet} />
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
