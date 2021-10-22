import findKey from 'lodash/findKey'
import axios from 'axios'
import {QuizContext} from '../machines/quiz-machine'

export default async function handleSubmitAnswer(context: QuizContext) {
  const {
    currentQuestion,
    currentQuestion: {tagId},
    questionSet,
    answer,
  } = context
  return axios.post('/api/answer', {
    tagId,
    survey: {
      id: findKey(questionSet, currentQuestion),
      answer,
    },
  })
}
