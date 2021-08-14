import * as React from 'react'

import {QuizAnswerPage} from '@skillrecordings/quiz'
import {Questions} from '@skillrecordings/types'

//TODO: Verify Styling

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questions: Questions = {
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
    props: {questions},
  }
}

export default QuizAnswerPage
