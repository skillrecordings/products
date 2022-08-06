import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from '../components/app/layout'

const Answer: React.FC<React.PropsWithChildren<{questionSet: QuestionSet}>> = ({
  questionSet,
}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="flex flex-col items-center justify-center w-full h-full px-5 py-24">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig({
            title: 'TypeScript Course',
            instructor: 'Joe Previte',
          })}
        />
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
