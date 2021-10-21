import * as React from 'react'
import findKey from 'lodash/findKey'
import axios from 'axios'
import {QuizContext} from '../machines/quiz-machine'

export default async function submitAnswer(context: QuizContext) {
  const {
    currentQuestion,
    currentQuestion: {tagId},
    questions,
    answer,
  } = context
  return axios
    .post('/api/answer', {
      tagId,
      survey: {
        id: findKey(questions, currentQuestion),
        answer,
      },
    })
    .catch((err) => {
      //   setError(err)
    })
    .then(() => {
      console.log('submit-answer', 'DONE')
      //   setAnswer(values)
      //   setSubmitting(false)
    })
}
