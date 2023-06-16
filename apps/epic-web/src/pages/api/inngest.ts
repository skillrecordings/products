import {serve} from 'inngest/next'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'
import {inngest} from 'utils/inngest.server'

type NewTipVideo = {
  name: 'tip/video.uploaded'
  data: {
    tipId: string
    videoResourceId: string
  }
}

type TranscriptCreatedEvent = {
  name: 'tip/video.transcript.created'
  data: {
    transcript: {
      text: string
      srt: string
    }
    videoResourceId: string
  }
}

type LLMSuggestionsCreated = {
  name: 'tip/video.llm.suggestions.created'
  data: {
    llmSuggestions: any
    videoResourceId: string
  }
}

export type IngestEvents = {
  'tip/video.uploaded': NewTipVideo
  'tip/video.transcript.created': TranscriptCreatedEvent
  'tip/video.llm.suggestions.created': LLMSuggestionsCreated
}

const processNewTip = inngest.createFunction(
  {name: 'Process New Tip Video'},
  {event: 'tip/video.uploaded'}, // The event that will trigger this function
  async ({event, step}) => {
    step.run('Create a Mux Asset', async () => {
      const videoResource = await sanityWriteClient.fetch(
        `*[_id == $videoResourceId][0]`,
        {
          videoResourceId: event.data.videoResourceId,
        },
      )
      const {originalMediaUrl, muxAsset, duration, _id} = videoResource
      const {duration: assetDuration, ...newMuxAsset} = await createMuxAsset({
        originalMediaUrl,
        muxAsset,
        duration,
      })

      return await sanityWriteClient
        .patch(_id)
        .set({
          duration,
          muxAsset: newMuxAsset,
        })
        .commit()
    })

    step.run('Initiate Transcript Order via Deepgram', async () => {
      const videoResource = await sanityWriteClient.fetch(
        `*[_id == $videoResourceId][0]`,
        {
          videoResourceId: event.data.videoResourceId,
        },
      )
      const {originalMediaUrl, _id} = videoResource
      return await fetch(
        `https://deepgram-wrangler.skillstack.workers.dev/transcript?videoUrl=${originalMediaUrl}&videoResourceId=${_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json())
    })

    const transcript = await step.waitForEvent('tip/video.transcript.created', {
      match: 'data.videoResourceId',
      timeout: '24h',
    })

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

      await step.run('Process LLM Suggestions', async () => {
        return await fetch(
          `https://deepgram-wrangler.skillstack.workers.dev/tipMetadataLLM?videoResourceId=${event.data.videoResourceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript: transcript.data.transcript.text,
            }),
          },
        )
      })

      const llmSuggestions = await step.waitForEvent(
        'tip/video.llm.suggestions.created',
        {
          match: 'data.videoResourceId',
          timeout: '24h',
        },
      )

      return {llmSuggestions, transcript}
    } else {
      throw new Error('Transcript not created within 24 hours')
    }

    // step 2: create transcript using deepgram api

    // Send the user a welcome email
    // await step.run('Send welcome email', () => sendEmail({ email: event.data.email, template: 'welcome' }))
    // Wait for the user to create an order, by waiting and
    // matching on another event
    // const order = await step.waitForEvent('app/order.created', {
    // 	match: 'data.user.id',
    // 	timeout: '24h',
    // })
    // if (!order) {
    // 	// User didn't create an order within 24 hours; send
    // 	// them an activation email
    // 	await step.run('Send activation email', async () => {
    // 		// Some code here
    // 	})
    // }
  },
)

export default serve(inngest, [processNewTip])
