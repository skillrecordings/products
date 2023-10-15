import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'
import {
  TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT,
  TIP_VIDEO_SRT_READY_EVENT,
  TIP_VIDEO_TRANSCRIPT_CREATED_EVENT,
  TIP_VIDEO_UPLOADED_EVENT,
} from 'inngest/events'

async function getVideoResource(videoResourceId: string) {
  return await sanityWriteClient.fetch(`*[_id == $videoResourceId][0]`, {
    videoResourceId,
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const processNewTip = inngest.createFunction(
  {
    id: 'process-new-tip',
    name: 'Process New Tip Video',
  },
  {event: TIP_VIDEO_UPLOADED_EVENT}, // The event that will trigger this function
  async ({event, step}) => {
    await step.run('Update Tip Status', async () => {
      return await sanityWriteClient
        .patch(event.data.tipId)
        .set({
          state: 'processing',
        })
        .commit()
    })

    const newMuxAsset = await step.run('Create a Mux Asset', async () => {
      const videoResource = await getVideoResource(event.data.videoResourceId)
      const {originalMediaUrl, muxAsset, duration} = videoResource
      return await createMuxAsset({
        originalMediaUrl,
        muxAsset,
        duration,
      })
    })

    await step.run('Sync Asset with Sanity', async () => {
      const videoResource = await getVideoResource(event.data.videoResourceId)
      const {duration: assetDuration, ...muxAsset} = newMuxAsset

      return await sanityWriteClient
        .patch(videoResource._id)
        .set({
          duration: assetDuration,
          muxAsset,
        })
        .commit()
    })

    await step.run('Initiate Transcript Order via Deepgram', async () => {
      const videoResource = await getVideoResource(event.data.videoResourceId)
      const {originalMediaUrl, _id} = videoResource
      return await fetch(
        `https://deepgram-wrangler.skillstack.workers.dev/transcript?videoUrl=${originalMediaUrl}&videoResourceId=${_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    })

    // Promise.all|race to wait for multiple events

    const transcript = await step.waitForEvent(
      'wait for the transcript to be completed',
      {
        event: TIP_VIDEO_TRANSCRIPT_CREATED_EVENT,
        match: 'data.videoResourceId',
        timeout: '1h',
      },
    )

    if (transcript) {
      await step.run('Update Video Resource with Transcript', async () => {
        return await sanityWriteClient
          .patch(event.data.videoResourceId)
          .set({
            transcript: {
              text: transcript.data.transcript.text,
              srt: transcript.data.transcript.srt,
            },
          })
          .commit()
      })

      await step.run('Notify SRT is Ready to Add to Mux Asset', async () => {
        return await inngest.send({
          name: TIP_VIDEO_SRT_READY_EVENT,
          data: {
            muxAssetId: newMuxAsset.muxAssetId,
            videoResourceId: event.data.videoResourceId,
            srt: transcript.data.transcript.srt,
          },
        })
      })

      await step.run('Send Transcript for LLM Suggestions', async () => {
        // this step initiates a call to worker and then doesn't bother waiting for a response
        // the sleep is just a small hedge to make sure we don't close the connection immediately
        // but the worker seems to run just fine if we don't bother waiting for a response
        // this isn't great, really, but waiting for the worker response times it out consistently
        // even with shorter content
        fetch(
          `https://deepgram-wrangler.skillstack.workers.dev/tipMetadataLLM?videoResourceId=${event.data.videoResourceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript: transcript.data.transcript.text,
              tipId: event.data.tipId,
            }),
          },
        )
        await sleep(1000)
        return 'Transcript sent to LLM'
      })

      const llmResponse = await step.waitForEvent(
        'wait for the llm suggestions to be completed',
        {
          event: TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT,
          match: 'data.videoResourceId',
          timeout: '1h',
        },
      )

      if (llmResponse) {
        await step.run('Update Tip with Generated Text', async () => {
          const title = llmResponse.data.llmSuggestions?.titles?.[0]
          const body = llmResponse.data.llmSuggestions?.body
          const description = llmResponse.data.llmSuggestions?.descriptions?.[0]
          return await sanityWriteClient
            .patch(event.data.tipId)
            .set({
              title,
              description,
              body,
              state: 'reviewing',
            })
            .commit()
        })
        return {llmSuggestions: llmResponse.data.llmSuggestions, transcript}
      } else {
        return {transcript, llmSuggestions: null}
      }
    } else {
      throw new Error('Transcript not created within 1 hours')
    }
  },
)
