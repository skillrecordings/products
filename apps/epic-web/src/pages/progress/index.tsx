import {SanityDocument} from '@sanity/client'
import {LessonProgress} from '@skillrecordings/database'
import {useQuery} from '@tanstack/react-query'
import {isArray} from 'lodash'
import React from 'react'
import {trpc} from 'trpc/trpc.client'
import {sanityClient} from 'utils/sanity-client'

const IframeComponent = () => {
  const {data: progressData, status: progressStatus} =
    trpc.progress.get.useQuery()

  const {data: sanityLessons, status: sanityLessonsStatus} = useQuery(
    [`lesson-for-progress`],
    async () => {
      if (!isArray(progressData)) return
      return sanityClient
        .fetch(
          `
        *[_id in [${progressData?.map(({lessonId}) => `'${lessonId}'`)}]]{
          "slug": slug.current
        }
      `,
        )
        .then((response: SanityDocument) => {
          return response
        })
    },
    {
      enabled: Boolean(progressData),
    },
  )

  //   console.log(`
  //   *[_id in [${progressData?.map(({lessonId}) => `'${lessonId}'`)}]]{
  //     slug
  //   }
  // `)
  console.log({sanityLessons, sanityLessonsStatus})

  // const handleTransformProgressData = (progressData: LessonProgress[]) => {
  //   // fetch from sanity and convert to {slug: 'lesson_slug'}
  //   const lessonSlugs = progressData.map((lesson) => lesson.slug)
  // }

  const reportProgress = (progressData: any, progressStatus: any) => {
    console.log('CHILD SENDING: kcdshop:progress:pending')
    window.parent.postMessage({type: 'kcdshop:progress:pending'}, '*')

    if (progressStatus === 'success') {
      console.log('CHILD SENDING: kcdshop:progress:resolved', progressData)
      window.parent.postMessage(
        {type: 'kcdshop:progress:resolved', progress: progressData},
        '*',
      )
    } else if (progressStatus === 'error') {
      console.log('CHILD SENDING: kcdshop:progress:rejected', progressData)
      window.parent.postMessage(
        {type: 'kcdshop:progress:rejected', error: progressData},
        '*',
      )
    }
  }

  React.useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.type === 'kcdshop:parent:ready') {
        console.log(`CHILD RECEIVED: ${event.data.type}`)
        console.log('CHILD SENDING: kcdshop:progress:ready')
        window.parent.postMessage({type: 'kcdshop:progress:ready'}, '*')
      }
      if (event.data.type === 'kcdshop:parent:get-progress') {
        console.log(`CHILD RECEIVED: ${event.data.type}`)
        reportProgress(progressData, progressStatus)
      }
    }

    console.log('CHILD SENDING: kcdshop:progress:ready')
    window.parent.postMessage({type: 'kcdshop:progress:ready'}, '*')

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [progressData, progressStatus])

  return null
}

export default IframeComponent
