import isEmpty from 'lodash/isEmpty'

type SanityQuiz = {
  title: string
  slug: string
  questions: any
}

export default function transformSanityQuiz(quiz: SanityQuiz) {
  const questionSet = quiz.questions.reduce((a: any, v: any) => {
    return {
      ...a,
      [v.id || v.questionId]: {
        ...v,
        // since correct field always returns an array
        // if there are multiple correct answers, we pass a string and render checkboxes
        // if there's only one, we pass a string and render radio buttons
        correct: !isEmpty(v.correct)
          ? v.correct.length > 1
            ? v.correct.map((ch: any) => ch)
            : v.correct[0]
          : null,
      },
    }
  }, {})

  return questionSet
}
