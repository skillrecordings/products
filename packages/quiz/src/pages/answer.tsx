import * as React from 'react'
import questionToShow from '../components/question-to-show'
import useQuestion from '../hooks/use-question'
import {useRouter} from 'next/router'
import {QuizConfig} from '../config'
import keys from 'lodash/keys'
import get from 'lodash/get'
import Link from 'next/link'
import type {QuestionResource, QuestionSet} from '@skillrecordings/types'

type AnswerProps = {
  questionSet: QuestionSet
  config?: QuizConfig
  syntaxHighlighterTheme?: any
}

const Answer: React.FC<React.PropsWithChildren<AnswerProps>> = ({
  config,
  questionSet,
  syntaxHighlighterTheme,
  children,
}) => {
  const router = useRouter()

  const [currentQuestion, setCurrentQuestion] =
    React.useState<QuestionResource>()
  const [currentAnswer, setCurrentAnswer] = React.useState<string | string[]>()

  React.useEffect(() => {
    const currentQuestionId = get(router.query, 'question', '')
    const currentQuestion = get(questionSet, currentQuestionId)
    setCurrentQuestion(currentQuestion)
    const currentAnswer = get(router.query, 'a')
    setCurrentAnswer(currentAnswer)
  }, [router, questionSet])

  const question = useQuestion({
    currentQuestion: currentQuestion,
    questionSet,
    config,
    currentAnswer,
    syntaxHighlighterTheme,
  })

  return (
    <>
      <div data-sr-quiz={question.isAnswered ? 'answered' : ''}>
        {question.currentQuestion && questionToShow(question)}
        {children}
        <DevTools questionSet={questionSet} />
      </div>
    </>
  )
}

export const sampleQuestions: QuestionSet = {
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

const DevTools: React.FC<
  React.PropsWithChildren<{questionSet: QuestionSet}>
> = ({questionSet}) => {
  const [hidden, setHidden] = React.useState(false)
  const router = useRouter()
  if (process.env.NODE_ENV !== 'development' || hidden) {
    return null
  }

  return (
    <nav className="z-10 flex border border-gray-100 dark:border-gray-700 flex-col fixed bottom-5 right-5 rounded-md bg-white dark:bg-gray-800 shadow-xl p-4 sm:visible invisible">
      <div className="w-full flex leading-tighter justify-end absolute right-2 top-2">
        <button
          onClick={() => setHidden(true)}
          className="text-xs text-black dark:text-white font-bold"
        >
          <span className="not-sr-only">✕</span>
          <span className="sr-only">close navigation</span>
        </button>
      </div>
      <span className="text-sm font-medium pb-2 text-indigo-600 dark:text-indigo-200">
        Questions:
      </span>
      <ul className="list-decimal list-inside">
        {keys(questionSet).map((q) => (
          <li className="pb-1" key={q}>
            <Link
              href={{
                pathname: router.pathname,
                query: {
                  question: q,
                },
              }}
              className={
                get(router.query, 'question') === q
                  ? 'underline'
                  : 'hover:underline'
              }
            >
              {q}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default Answer
