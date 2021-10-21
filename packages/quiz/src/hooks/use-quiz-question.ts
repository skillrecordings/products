import type {QuestionResource, Questions, Choice} from '@skillrecordings/types'
import * as React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import every from 'lodash/every'
import isArray from 'lodash/isArray'
import findKey from 'lodash/findKey'
import get from 'lodash/get'
import {useFormik, FormikProps} from 'formik'
import {useMachine} from '@xstate/react'
import quizMachine from '../machines/quiz-machine'
import {useRouter} from 'next/router'
import {QuestionProps} from '../components/question/index'

function useQuestion(questions: Questions): QuestionProps {
  const router = useRouter()

  const [state, send] = useMachine(quizMachine, {
    context: {
      questions,
    },
  })

  React.useEffect(() => {
    const questionId = router.isReady && get(router.query, 'question')
    questionId && send('LOAD_QUESTION', {questionId})
  }, [router])

  console.log(state.value, state.context)

  const currentQuestion = state.context.currentQuestion

  const {correct} = currentQuestion || {}
  const answer = state.context.answer
  const isAnswered = state.matches('answered') // !isEmpty(answer)
  const isSubmitting = state.matches('answering')
  const hasMultipleCorrectAnswers = isArray(correct)

  function isCorrectChoice(choice: Choice): boolean {
    return correct && hasMultipleCorrectAnswers
      ? correct.includes(choice.answer)
      : correct === choice?.answer
  }

  function answeredCorrectly(): boolean {
    const allCorrect: any =
      isArray(answer) && every(answer.map((a: string) => correct?.includes(a)))

    return isAnswered && hasMultipleCorrectAnswers
      ? allCorrect
      : correct === answer
  }

  type Values = {
    answer: string | null
  }

  const formik: FormikProps<Values> = useFormik<Values>({
    initialValues: {
      answer: null,
    },
    validationSchema: Yup.object({
      answer: correct
        ? hasMultipleCorrectAnswers
          ? Yup.array()
              // .min(correct.length, `Pick at least ${correct.length}.`)
              .required('Pick at least one option.')
              .label('Options')
              .nullable()
          : Yup.string().required('Please pick an option.').nullable()
        : Yup.string()
            .nullable()
            .required(`Can't stay empty. Mind to elaborate? :)`),
    }),
    onSubmit: async (values) => {
      send('ANSWER', {answer: values.answer})
    },
    validateOnChange: false,
  })

  return {
    currentQuestion,
    isCorrectChoice: (choice: Choice) => isCorrectChoice(choice),
    answeredCorrectly: answeredCorrectly(),
    onSubmit: formik.handleSubmit,
    hasMultipleCorrectAnswers,
    isSubmitting,
    isAnswered,
    questions,
    formik,
  }
}

export default useQuestion
