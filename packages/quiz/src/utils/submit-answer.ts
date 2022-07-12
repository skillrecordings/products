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

  // TODO check Sanity API structure versus static JSON structure
  //      they should be the same! It appears as though that might not be the case
  let id =
    findKey(questionSet, currentQuestion) ||
    findKey(
      questionSet,
      (question) => question.question === currentQuestion.question,
    )

  return axios.post('/api/answer', {
    tagId,
    survey: {
      id,
      answer,
    },
  })
}
