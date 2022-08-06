import * as React from 'react'
import {QuizAnswerPage, transformSanityQuiz} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getQuiz} from 'lib/quizzes'
import {PortableText} from '@portabletext/react'
import PortableTextComponents from 'components/portable-text'
import type {PortableTextBlock} from '@portabletext/types'

const quizSlug = 'email-course'

type SanityQuiz = {
  title: string
  slug: string
  questions: any
}

const Answer: React.FC<React.PropsWithChildren<{quiz: SanityQuiz}>> = ({
  quiz,
}) => {
  const questionSet: QuestionSet = transformSanityQuiz(quiz)
  return (
    <Layout noIndex meta={{title: 'Quiz'}} className="bg-brand-purple">
      <header className="max-w-2xl w-full px-4 mx-auto sm:pt-32 pt-24">
        <h1 className="md:text-5xl text-4xl font-bold">Quiz</h1>
      </header>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig({
            questionBodyRenderer: (question: PortableTextBlock) => (
              <PortableText
                value={question}
                components={PortableTextComponents}
              />
            ),
          })}
        />
      </div>
    </Layout>
  )
}

const Image = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const quiz = await getQuiz(`${quizSlug}`)

  return {
    props: {quiz},
  }
}

export default Answer
