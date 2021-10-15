import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {Questions} from '@skillrecordings/types'
import Layout from 'components/app/layout'

const Answer = ({questions}: any) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <QuizAnswerPage
        questions={questions}
        author={'Emma Bostian'}
        title="CSS Destructured"
      />
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questions: Questions = {
    welcome: {
      question: `Is this a welcome question?`,
      type: `essay`,
      answer: `Yes, it indeed is.`,
      tagId: 1234567, // TODO
    },
  }
  return {
    props: {questions},
  }
}

export default Answer
