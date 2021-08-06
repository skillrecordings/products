import * as React from 'react'
import {get, isEmpty, keys} from 'lodash'
import {useRouter} from 'next/router'
import Layout from 'layouts'
import Link from 'next/link'
import EssayQuestion from 'components/forms/quiz/essay-question'
import MultipleChoiceQuestion from 'components/forms/quiz/multiple-choice-question'

export type Question = {
  question: string
  type: 'multiple-choice' | 'essay'
  tagId: number
  correct?: string[] | string
  answer?: string
  choices?: {answer: string; label: string}[]
}

export type Questions = {
  [key: string]: Question
}

type AnswerProps = {
  questions: Questions
}

const Answer: React.FC<AnswerProps> = () => {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = React.useState<Question>()

  React.useEffect(() => {
    const param: any = get(router.query, 'question')
    if (!isEmpty(param)) {
      const question = get(questions, param)
      setCurrentQuestion(question)
    }
  }, [router])

  const QuestionToShow = () => {
    if (!currentQuestion) {
      return null
    }
    switch (currentQuestion.type as string) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion question={currentQuestion as Question} />
      default:
        return <EssayQuestion question={currentQuestion as Question} />
    }
  }

  return (
    <>
      <DevTools questions={questions} />
      <Layout noIndex meta={{title: 'Quiz'}}>
        <header>
          <Link href="/">
            <a aria-label="Home" className="sm:w-36 w-28 sm:mt-6 mt-4 absolute">
              <h1 className="sr-only">Quiz</h1>
            </a>
          </Link>
        </header>
        <div className="max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8">
          {QuestionToShow()}
        </div>
      </Layout>
    </>
  )
}

export const questions: Questions = {
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
    <nav className="z-10 flex border border-gray-100 flex-col fixed top-5 right-5 rounded-md bg-white shadow-xl p-4 sm:visible invisible">
      <div className="w-full flex leading-tighter justify-end absolute right-2 top-2">
        <button
          onClick={() => setHidden(true)}
          className="text-xs text-black font-bold"
        >
          <span className="not-sr-only">✕</span>
          <span className="sr-only">close navigation</span>
        </button>
      </div>
      <span className="text-sm font-medium pb-2 text-indigo-600">
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
