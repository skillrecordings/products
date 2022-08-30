import React from 'react'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {VideoProvider} from 'context/video-context'
import {GetServerSideProps} from 'next'
import {getModule} from 'lib/modules'
import {getLesson} from 'lib/lessons'
import {useRouter} from 'next/router'
import LessonTemplate from 'templates/lesson-template'
import toast from 'react-hot-toast'
import get from 'lodash/get'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const lesson = await getLesson(params?.lesson as string)

  if (!lesson) {
    return {
      notFound: true,
    }
  }

  const module = await getModule(params?.module as string)

  return {
    props: {lesson, module},
  }
}

const LessonPage: React.FC<any> = ({lesson, module}) => {
  const router = useRouter()

  React.useEffect(() => {
    const ckId = get(router.query, CK_SUBSCRIBER_KEY)
    const email = get(router.query, 'email')
    if (ckId) {
      const message = `A confirmation email was sent${
        email ? ` to ${email}.` : '.'
      } Please click the confirmation button in this email to confirm your subscription.`
      toast(message, {
        icon: '✉️',
        duration: 8000,
      })
    }
    // router.replace({pathname: router.asPath, query: undefined})
  }, [])

  return (
    <VideoProvider>
      <LessonTemplate lesson={lesson} module={module} />
    </VideoProvider>
  )
}

export default LessonPage
