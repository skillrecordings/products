import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import Layout from '@skillrecordings/react/dist/layouts'

const Answer: React.FC<React.PropsWithChildren<{questionSet: QuestionSet}>> = ({
  questionSet,
}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="h-full w-full flex flex-col items-center justify-center py-24 px-5">
        <QuizAnswerPage questionSet={questionSet} />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questionSet: QuestionSet = {
    essay: {
      question: `## Lorem ipsum dolor sit amet?`,
      type: `essay`,
      tagId: 0, // TODO
    },
    trueFalse: {
      question: `## True or false: Lorem ipsum dolor sit amet?`,
      type: `multiple-choice`,
      tagId: 0, // TODO
      correct: 'true',
      answer: `Yes! Lorem ipsum!`,
      choices: [
        {
          answer: 'true',
          label: 'Yes',
        },
        {
          answer: 'false',
          label: 'No',
        },
      ],
    },
    multipleCorrect: {
      question: `## Lorem ipsum dolor sit amet?`,
      type: `multiple-choice`,
      tagId: 0, // TODO
      correct: ['one', 'two'],
      answer: `Yes! Lorem ipsum!`,
      choices: [
        {
          answer: 'one',
          label: 'One',
        },
        {
          answer: 'two',
          label: 'Two',
        },
        {
          answer: 'three',
          label: 'Three',
        },
        {
          answer: 'four',
          label: 'Four',
        },
      ],
    },
  }
  return {
    props: {questionSet},
  }
}

export default Answer
