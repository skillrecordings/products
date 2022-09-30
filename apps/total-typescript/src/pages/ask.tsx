import React from 'react'
import {QuizResource} from '@skillrecordings/types'
import Layout from 'components/app/layout'
import {surveyConfig, surveyData} from 'components/survey/survey-config'
import {get} from 'lodash'
import {GetStaticProps} from 'next'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {useRouter} from 'next/router'
import Image from 'next/image'

export const SURVEY_ID = 'ask'

export const getStaticProps: GetStaticProps = ({params}) => {
  const survey = get(surveyData, SURVEY_ID)
  return {
    props: {survey},
    revalidate: 10,
  }
}

const Ask: React.FC<{survey: QuizResource}> = ({survey}) => {
  const router = useRouter()
  const title =
    get(survey.questions, `${router.query.question}`)?.question || 'Ask'

  return (
    <Layout
      noIndex
      meta={{
        title,
      }}
    >
      <div
        className="h-full flex-grow flex sm:items-center items-start justify-center py-16"
        id="ask"
      >
        <QuizAnswerPage config={surveyConfig} questionSet={survey.questions}>
          <div
            data-sr-quiz-question-footer=""
            className="absolute -z-10 opacity-70 pt-16"
          >
            <Image
              src={require('../../public/assets/check-mark@2x.png')}
              width={500}
              height={500}
              quality={100}
              placeholder="blur"
            />
          </div>
        </QuizAnswerPage>
      </div>
    </Layout>
  )
}

export default Ask
