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

type SRTReadyEvent = {
  name: 'tip/video.srt.ready'
  data: {
    srt: string
    muxAssetId: string
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
  'tip/video.srt.ready': SRTReadyEvent
  'tip/video.llm.suggestions.created': LLMSuggestionsCreated
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getVideoResource(videoResourceId: string) {
  return await sanityWriteClient.fetch(`*[_id == $videoResourceId][0]`, {
    videoResourceId,
  })
}

const addSrtToMuxAsset = inngest.createFunction(
  {name: 'Add SRT to Mux Asset'},
  {event: 'tip/video.srt.ready'},
  async ({event, step}) => {
    const muxAssetStatus = await step.run(
      'Check if Mux Asset is Ready',
      async () => {
        const {Video} = new Mux()
        const {status} = await Video.Assets.get(event.data.muxAssetId)
        return status
      },
    )

    if (muxAssetStatus === 'ready') {
      await step.run(
        'Check for existing subtitles in Mux and remove if found',
        async () => {
          const {Video} = new Mux()
          const {tracks} = await Video.Assets.get(event.data.muxAssetId)

          const existingSubtitle = tracks?.find(
            (track: any) => track.name === 'English',
          )

          if (existingSubtitle) {
            return await Video.Assets.deleteTrack(
              event.data.muxAssetId,
              existingSubtitle.id,
            )
          } else {
            return 'No existing subtitle found.'
          }
        },
      )

      await step.run('Update Mux with SRT', async () => {
        const {Video} = new Mux()
        return await Video.Assets.createTrack(event.data.muxAssetId, {
          url: `https://www.epicweb.dev/api/videoResource/${event.data.videoResourceId}/srt`,
          type: 'text',
          text_type: 'subtitles',
          closed_captions: false,
          language_code: 'en-US',
          name: 'English',
          passthrough: 'English',
        })
      })
    } else {
      await step.sleep(60000)
      await step.run('Re-run After Cooldown', async () => {
        return await inngest.send({
          name: 'tip/video.srt.ready',
          data: event.data,
        })
      })
    }
  },
)

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

    const transcript = await step.waitForEvent('tip/video.transcript.created', {
      match: 'data.videoResourceId',
      timeout: '1h',
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

      await step.run('Notify SRT is Ready to Add to Mux Asset', async () => {
        return await inngest.send({
          name: 'tip/video.srt.ready',
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
            }),
          },
        )
        await sleep(1000)
        return 'Transcript sent to LLM'
      })

      const llmResponse = await step.waitForEvent(
        'tip/video.llm.suggestions.created',
        {
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

export default serve(inngest, [processNewTip, addSrtToMuxAsset])
