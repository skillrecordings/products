import * as React from 'react'
import * as Yup from 'yup'
import type {
  QuestionSet,
  Choice,
  QuestionResource,
} from '@skillrecordings/types'
import {nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import {QuestionProps} from '../components/question/index'
import quizMachine from '../machines/quiz-machine'
import {useFormik, FormikProps} from 'formik'
import {useMachine} from '@xstate/react'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import last from 'lodash/last'
import getConfig, {QuizConfig} from '../config'

export type FormikValues = {
  answer: string | string[] | null
}
type useQuestionTypes = {
  currentQuestion: QuestionResource | undefined
  questionSet?: QuestionSet
  config?: QuizConfig
  currentAnswer?: string | string[] | undefined
  syntaxHighlighterTheme?: any
  questionBodyRenderer?: any
}

export default function useQuestion({
  currentQuestion,
  questionSet,
  config,
  currentAnswer,
  syntaxHighlighterTheme,
  questionBodyRenderer,
}: useQuestionTypes): QuestionProps {
  const [state, send] = useMachine(quizMachine, {
    context: {
      questionSet,
      config,
    },
  })

  const parsedCurrentAnswer =
    currentAnswer && currentQuestion && isArray(currentQuestion.correct)
      ? isArray(currentAnswer)
        ? currentAnswer
        : currentAnswer.split(',')
      : currentAnswer

  React.useEffect(() => {
    currentQuestion && send('LOAD_QUESTION', {currentQuestion})
    currentAnswer &&
      currentQuestion &&
      send('ANSWER', {
        answer: parsedCurrentAnswer,
      })
  }, [currentQuestion, currentAnswer, send])

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(state.value, state.context)
    }
  }, [state])

  const question = state.context.currentQuestion
  const {correct} = question || {}
  const isAnswered = state.matches('answered')
  const isSubmitting = state.matches('answering')
  const hasCorrectAnswer = !isEmpty(correct)
  const hasMultipleCorrectAnswers = isArray(correct)
  const answeredNeutral = state.matches('answered.neutral')
  const questionsKeys: string[] | undefined =
    questionSet && Object.keys(questionSet)
  const lastQuestionKey: string | undefined = last(questionsKeys)
  const isLast: boolean =
    questionSet && lastQuestionKey
      ? questionSet[lastQuestionKey] === currentQuestion
      : false

  function isCorrectChoice(choice: Choice): boolean {
    return correct && hasMultipleCorrectAnswers
      ? correct.includes(choice.answer)
      : correct === choice?.answer
  }

  const answeredCorrectly = state.matches('answered.correct')

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {
      answer: currentAnswer ? currentAnswer : null,
    },
    validationSchema: Yup.object({
      answer: correct
        ? hasMultipleCorrectAnswers
          ? Yup.array()
              .required('Pick at least one option.')
              .label('Options')
              .nullable()
          : Yup.string().required('Pick an option.').nullable()
        : Yup.string()
            .nullable()
            .required(`Can't stay empty. Mind to elaborate? :)`),
    }),
    onSubmit: async (values) => {
      return send('ANSWER', {answer: values.answer})
    },
    validateOnChange: true,
    enableReinitialize: true,
  })

  return {
    currentQuestion: question,
    isCorrectChoice: (choice: Choice) => isCorrectChoice(choice),
    answeredCorrectly,
    answeredNeutral,
    onSubmit: formik.handleSubmit,
    hasMultipleCorrectAnswers,
    hasCorrectAnswer,
    isSubmitting,
    isAnswered,
    questionSet,
    formik,
    isLast,
    currentAnswer,
    answer: state.context.answer,
    config: config || getConfig({}),
    syntaxHighlighterTheme: syntaxHighlighterTheme || nightOwl,
  }
}
