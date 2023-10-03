import React, {useEffect, useState} from 'react'
import {trpc} from 'trpc/trpc.client'

const IframeComponent = () => {
  const {data: progressData, status: progressStatus} =
    trpc.progress.get.useQuery()

  useEffect(() => {
    // Send the initial message when the component is mounted
    if (progressStatus === 'success') {
      window.parent.postMessage(
        {
          type: 'kcdshop:progress:resolved',
          progress: progressData,
        },
        '*',
      )
    }
  }, [progressStatus, progressData])

  // Add an event listener to listen for messages from the parent
  useEffect(() => {
    const handleParentMessage = (event: any) => {
      if (event.data.type === 'kcdshop:parent:get-progress') {
        console.log('CHILD RECEIVED: kcdshop:parent:get-progress')
        // If the data is ready, respond with progress data
        if (progressStatus === 'success') {
          window.parent.postMessage(
            {
              type: 'kcdshop:progress:resolved',
              progress: progressData,
            },
            '*',
          )
        } else {
          // Handle the case where data is not yet ready
          console.log('CHILD SENDING: kcdshop:progress:pending')
          window.parent.postMessage({type: 'kcdshop:progress:pending'}, '*')
        }
      }
    }

    // Add the event listener
    window.addEventListener('message', handleParentMessage)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleParentMessage)
    }
  }, [progressStatus, progressData])

  return <div />
}

export default IframeComponent
