import {serve} from 'inngest/next'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'
import {inngest} from 'utils/inngest.server'
import Mux from '@mux/mux-node'

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

async function getVideoResource(videoResourceId: string) {
  return await sanityWriteClient.fetch(`*[_id == $videoResourceId][0]`, {
    videoResourceId,
  })
}

const processNewTip = inngest.createFunction(
  {name: 'Process New Tip Video'},
  {event: 'tip/video.uploaded'}, // The event that will trigger this function
  async ({event, step}) => {
    await step.run('Update Tip Status', async () => {
      return await sanityWriteClient
        .patch(event.data.tipId)
        .set({
          state: 'processing',
        })
        .commit()
    })

    const newMuxAsset: any = await step.run('Create a Mux Asset', async () => {
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

      await step.run(
        'Check for existing subtitles in Mux and remove if found',
        async () => {
          const videoResource = await getVideoResource(
            event.data.videoResourceId,
          )
          const {Video} = new Mux()
          const {tracks} = await Video.Assets.get(
            videoResource.muxAsset.muxAssetId,
          )

          const existingSubtitle = tracks?.find(
            (track: any) => track.name === 'English',
          )

          if (existingSubtitle) {
            return await Video.Assets.deleteTrack(
              videoResource.muxAsset.muxAssetId,
              existingSubtitle.id,
            )
          } else {
            return 'No existing subtitle found.'
          }
        },
      )

      await step.run('Update Mux with SRT', async () => {
        const videoResource = await getVideoResource(event.data.videoResourceId)
        const {Video} = new Mux()
        return await Video.Assets.createTrack(
          videoResource.muxAsset.muxAssetId,
          {
            url: `https://www.epicweb.dev/api/videoResource/${videoResource._id}/srt`,
            type: 'text',
            text_type: 'subtitles',
            closed_captions: false,
            language_code: 'en-US',
            name: 'English',
            passthrough: 'English',
          },
        )
      })

      await step.run('Send Transcript for LLM Suggestions', async () => {
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

      const llmResponse = await step.waitForEvent(
        'tip/video.llm.suggestions.created',
        {
          match: 'data.videoResourceId',
          timeout: '24h',
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
      throw new Error('Transcript not created within 24 hours')
    }
  },
)

export default serve(inngest, [processNewTip])
