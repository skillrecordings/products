import * as React from 'react'
import {get, isEmpty, keys} from 'lodash'
import {useRouter} from 'next/router'
import type {Question, Questions} from '@skillrecordings/types'
import QuestionToShow from '../components/question'

type AnswerProps = {
  questions: Questions
  author?: string
  title?: string
  markdownProps?: any
}

const Answer: React.FC<AnswerProps> = ({
  questions,
  author,
  title,
  markdownProps,
}) => {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = React.useState<Question>()

  React.useEffect(() => {
    const param: any = get(router.query, 'question')
    if (!isEmpty(param)) {
      const question = get(questions, param)
      setCurrentQuestion(question)
    }
  }, [router])

  return (
    <>
      <DevTools questions={questions} />
      <div data-sr-quiz>
        <h1>Quiz</h1>
        {currentQuestion && (
          <QuestionToShow
            markdownProps={markdownProps}
            question={currentQuestion as Question}
            questions={questions}
            author={author}
            title={title}
          />
        )}
      </div>
    </>
  )
}

export const sampleQuestions: Questions = {
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

const DevTools: React.FC<{questions: Questions}> = ({questions}) => {
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
      <ol className="list-decimal list-inside">
        {keys(questions).map((q) => (
          <li className="pb-1" key={q}>
            <a
              href={`/answer?question=${q}`}
              className={
                get(router.query, 'question') === q
                  ? 'underline'
                  : 'hover:underline'
              }
            >
              {q}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
export default Answer
