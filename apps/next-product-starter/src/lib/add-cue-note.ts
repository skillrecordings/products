import axios from 'axios'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import readingTime from 'reading-time'
import {LessonResource} from '@skillrecordings/types'

const addCueNote =
  (context: VideoStateContext, _event: VideoEvent) => async (send: any) => {
    const cueNote = {
      text: context?.cueFormElemRef?.current?.input.value,
      startTime: context.currentTime,
      endTime: context.currentTime,
    } as VTTCue

    const resource = context.resource as LessonResource

    await axios
      .post(`/api/lessons/notes/${resource.slug}`, {
        text: cueNote.text,
        startTime: context.currentTime,
        endTime: context.currentTime + readingTime(cueNote.text).time / 1000,
        state: context.writingCueNoteVisibility,
        contact_id: context.viewer.contact_id,
        image: context.viewer.avatar_url,
      })
      .catch(() => {
        send('FAIL')
      })
      .then(({data}: any) => {
        const cue = new VTTCue(
          cueNote.startTime,
          cueNote.endTime,
          `{"id":"${data.id}","text":"${data.text}","type":"${data.type}","image":"${data.image}","startTime":${data.start_time},"endTime":${data.end_time}}`,
        )
        send({type: 'DONE_SUBMITTING_NOTE', cue: cue})

        // reset form
        context.cueFormElemRef?.current?.input.blur()
        context.cueFormElemRef?.current?.reset()
      })
  }

export default addCueNote
