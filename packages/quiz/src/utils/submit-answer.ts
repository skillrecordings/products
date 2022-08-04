import findKey from 'lodash/findKey'
import axios from 'axios'
import {QuizContext} from '../machines/quiz-machine'

export default async function handleSubmitAnswer(context: QuizContext) {
  const {
    currentQuestion,
    currentQuestion: {tagId},
    questionSet,
    answer,
    config,
  } = context

  const apiUrl =
    config.answerSubmitUrl ||
    process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL ||
    '/api/answer'

  const id = findKey(
    questionSet,
    (question) => question.question === currentQuestion.question,
  )

  return axios.post(apiUrl, {
    tagId,
    survey: {
      id,
      answer,
    },
  })
}
