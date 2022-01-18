import axios from 'axios'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import readingTime from 'reading-time'
import {LessonResource} from '@skillrecordings/types'

const addCueNote =
  (context: VideoStateContext, _event: VideoEvent) => async (send: any) => {
    const cue = {
      text: context?.cueFormElemRef?.current?.input.value,
      startTime: context.currentTime,
      endTime: context.currentTime,
    } as VTTCue

    const resource = context.resource as LessonResource

    await axios
      .post(`/api/lessons/notes/${resource.slug}`, {
        text: cue.text,
        startTime: context.currentTime,
        endTime: context.currentTime + readingTime(cue.text).time / 1000,
        state: context.writingCueNoteVisibility,
        contact_id: context.viewer.contact_id,
        image: context.viewer.avatar_url,
      })
      .catch(() => {
        send('FAIL')
      })
      .then(() => {
        send('DONE_SUBMITTING_NOTE')
        context.cueFormElemRef?.current?.input.blur()
        context.cueFormElemRef?.current?.reset()
        // context.cueFormElemRef?.current?.input.value = ''
      })
  }

export default addCueNote
