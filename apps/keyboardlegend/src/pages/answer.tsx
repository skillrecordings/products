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
                default:
                  'Thanks! Keep an eye on your inbox for the next email.',
                last: 'Thanks! Keep an eye on your inbox for the next email.',
              },
              correct: {
                default:
                  'Thanks! Keep an eye on your inbox for the next email.',
                last: 'Thanks! Keep an eye on your inbox for the next email.',
              },
              incorrect: {
                default:
                  'Thanks! Keep an eye on your inbox for the next email.',
                last: 'Thanks! Keep an eye on your inbox for the next email.',
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
