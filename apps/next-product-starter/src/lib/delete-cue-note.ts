import axios from 'axios'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'

const deleteCueNote =
  (context: VideoStateContext, _event: VideoEvent) => async () => {
    const cueId = JSON.parse(context.activeCues[0].text).id
    await axios
      .delete(`/api/lessons/notes/${context.resource.slug}?id=${cueId}`)
      .catch((e) => {
        console.log(`Failed to delete cue note: ${e.message}`)
      })
  }

export default deleteCueNote
