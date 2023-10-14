import {inngest} from 'inngest/inngest.server'
import Mux from '@mux/mux-node'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {TIP_VIDEO_SRT_READY_EVENT} from 'inngest/events'

export const addSrtToMuxAsset = inngest.createFunction(
  {
    id: 'add-srt-mux-asset',
    name: 'Add SRT to Mux Asset',
  },
  {event: TIP_VIDEO_SRT_READY_EVENT},
  async ({event, step}) => {
    const muxAssetStatus = await step.run(
      'Check if Mux Asset is Ready',
      async () => {
        const {Video} = new Mux()
        const {status} = await Video.Assets.get(event.data.muxAssetId)
        return status
      },
    )

    await step.run('Update Video Resource Status', async () => {
      return await sanityWriteClient
        .patch(event.data.videoResourceId)
        .set({
          state: muxAssetStatus,
        })
        .commit()
    })

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

      // await step.run('Notify in Slack', async () => {
      //
      // })
    } else {
      await step.sleep('wait for 10 seconds', 60000)
      await step.run('Re-run After Cooldown', async () => {
        return await inngest.send({
          name: TIP_VIDEO_SRT_READY_EVENT,
          data: event.data,
        })
      })
    }
  },
)
