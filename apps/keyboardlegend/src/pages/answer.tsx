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
import common from 'text/common'

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
    <Layout noIndex meta={{title: 'Email Course'}} className="py-32">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <QuizAnswerPage
          questionSet={questionSet}
          config={{
            answerSubmitUrl: process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL,
            afterCompletionMessages: {
              neutral: {
                default: common['quiz-answer-neutral-default'],
                last: common['quiz-answer-neutral-last'],
              },
              correct: {
                default: common['quiz-answer-correct-default'],
                last: common['quiz-answer-correct-last'],
              },
              incorrect: {
                default: common['quiz-answer-incorrect-default'],
                last: common['quiz-answer-incorrect-last'],
              },
            },
            questionBodyRenderer: (question) => (
              <PortableText
                value={question}
                components={PortableTextComponents}
              />
            ),
          }}
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
