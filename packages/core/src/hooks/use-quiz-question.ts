import axios from 'axios'
import {useFormik} from 'formik'
import {every, find, isArray, map} from 'lodash'
import isEmpty from 'lodash/isEmpty'
import React from 'react'
import * as Yup from 'yup'
import {Question, Choice} from '../@types'

function useQuestion(question: Question) {
  const [answer, setAnswer] = React.useState<any>()
  const [error, setError] = React.useState<any>()
  const {tagId, correct} = question || {}
  const hasMultipleCorrectAnswers = isArray(correct)
  const isAnswered = !isEmpty(answer)
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      answer: null,
    },
    validationSchema: Yup.object({
      answer: correct
        ? hasMultipleCorrectAnswers
          ? Yup.array()
              // .min(correct.length, `Pick at least ${correct.length}.`)
              .required('Please pick at least one option.')
              .label('Options')
              .nullable()
          : Yup.string()
              .required('Please pick an option.')
              .nullable()
        : Yup.string()
            .nullable()
            .required(`Can't stay empty. Mind to elaborate? :)`),
      // comment: Yup.string().nullable().required(),
    }),
    onSubmit: async values => {
      // await new Promise((r) => setTimeout(r, 500))
      setSubmitting(true)
      axios
        .post('/api/answer', {
          tagId,
        })
        .then(() => {
          setAnswer(values)
          setSubmitting(false)
        })
    },
    validateOnChange: false,
  })

  const isCorrectAnswer = (choice: Choice): boolean => {
    return correct && hasMultipleCorrectAnswers
      ? correct.includes(choice.answer)
      : correct === choice?.answer
  }

  const answeredCorrectly = (): boolean => {
    const allCorrect: any =
      isArray(answer?.answer) &&
      every(answer.answer.map((a: string) => correct?.includes(a)))

    return isAnswered && hasMultipleCorrectAnswers
      ? allCorrect
      : correct === answer?.answer
  }

  return {
    isCorrectAnswer: (props: any) => isCorrectAnswer(props as any),
    answeredCorrectly: answeredCorrectly(),
    onAnswer: formik.handleSubmit,
    hasMultipleCorrectAnswers,
    isSubmitting,
    isAnswered,
    formik,
    error,
  }
}

export default useQuestion
