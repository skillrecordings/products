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
      if (!isArray(progressData)) return []
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

  const reportProgress = (progressData: any, sanityLessonsStatus: any) => {
    console.log('CHILD SENDING: kcdshop:progress:pending')
    window.parent.postMessage({type: 'kcdshop:progress:pending'}, '*')

    if (sanityLessonsStatus === 'success') {
      console.log('CHILD SENDING: kcdshop:progress:resolved', progressData)
      window.parent.postMessage(
        {type: 'kcdshop:progress:resolved', progress: progressData},
        '*',
      )
    } else if (sanityLessonsStatus === 'error') {
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
        reportProgress(sanityLessons, sanityLessonsStatus)
      }
    }

    console.log('CHILD SENDING: kcdshop:progress:ready')
    window.parent.postMessage({type: 'kcdshop:progress:ready'}, '*')

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [sanityLessons, sanityLessonsStatus])

  return null
}

export default IframeComponent

// ——————————————————————
// ——— PARENT EXAMPLE ———
// ——————————————————————

export const ParentComponent = () => {
  const iframeRef = React.useRef<any>(null)

  const handleIframeLoad = () => {
    // Once the iframe is loaded, we can start communicating with it.
    iframeRef.current.contentWindow.postMessage(
      {type: 'kcdshop:parent:ready'},
      '*',
    )
  }

  const handleReceiveMessage = (event: any) => {
    // Handle messages received from the child iframe.
    if (event.data.type === 'kcdshop:progress:ready') {
      // The child iframe is ready.
      console.log('PARENT RECEIVED: kcdshop:progress:ready')
      // Request progress data from the child iframe
      iframeRef.current.contentWindow.postMessage(
        {type: 'kcdshop:parent:get-progress'},
        '*',
      )
    } else if (event.data.type === 'kcdshop:progress:resolved') {
      // Handle progress data received from the child iframe.
      console.log(
        'PARENT RECEIVED: kcdshop:progress:resolved',
        event.data.progress,
      )
    } else if (event.data.type === 'kcdshop:progress:rejected') {
      // Handle error data received from the child iframe.
      console.error(
        'PARENT RECEIVED: kcdshop:progress:rejected',
        event.data.error,
      )
    }
  }

  React.useEffect(() => {
    // Attach an event listener to handle messages from the child iframe.
    window.addEventListener('message', handleReceiveMessage)
    return () => {
      window.removeEventListener('message', handleReceiveMessage)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={`${process.env.NEXT_PUBLIC_URL}/progress`}
      onLoad={handleIframeLoad}
    />
  )
}
