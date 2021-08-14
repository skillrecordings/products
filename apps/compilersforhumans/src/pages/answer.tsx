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
        <div className="px-5 max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8">
          {QuestionToShow()}
        </div>
      </Layout>
    </>
  )
}

export const questions: Questions = {
  welcome: {
    question: `## In your own words, what happens between when you write the code and when someone uses the application?`,
    type: `essay`,
    tagId: 2514815, // ec - c4h - 001 Welcome completed
  },
  transpilation: {
    question: `## You tried to use the new findLast array method and your project won’t build, what failed?`,
    type: `multiple-choice`,
    tagId: 2514822, // ec - c4h - 002 Three Steps completed
    correct: ['parsing'],
    answer: ``,
    choices: [
      {
        answer: 'parsing',
        label: 'Parsing',
      },
      {
        answer: 'transform',
        label: 'Transform',
      },
      {
        answer: 'codegen',
        label: 'Code Generation',
      },
      {
        answer: 'semicolon',
        label: 'Semicolons',
      },
    ],
  },
  asts: {
    question: `Given the line of code \`const example = true;\`, how does the AST representation change if we use \`let\` instead? What if we change \`example\` to be a string \`"My new boolean"\`? Use [astexplorer.net](https://astexplorer.net) for help!`,
    type: `essay`,
    tagId: 2514826, // ec - c4h - 003 ASTs completed
  },
  transform: {
    question: `Given the line of code \`let example = true;\`, write a transform that will replace \`let\` with \`const\` for only this line. Submit your code snippet below.`,
    type: `essay`,
    tagId: 2514835, // ec - c4h - 004 Transform completed
  },
  codegen: {
    question: `## What compiler topics are you most interested in exploring further?`,
    type: `essay`,
    tagId: 2514839, // ec - c4h - 005 codegen completed
  },
}

const DevTools: React.FC<{questions: Questions}> = ({questions}) => {
  const [hidden, setHidden] = React.useState(false)
  const router = useRouter()
  if (process.env.NODE_ENV !== 'development' || hidden) {
    return null
  }

  return (
    <nav className="z-10 flex border border-gray-100 dark:border-gray-700 flex-col fixed top-5 right-5 rounded-md bg-white dark:bg-gray-800 shadow-xl p-4 sm:visible invisible">
      <div className="w-full flex leading-tighter justify-end absolute right-2 top-2">
        <button
          onClick={() => setHidden(true)}
          className="text-xs text-black font-bold"
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
