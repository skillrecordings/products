import {useSelector} from '@xstate/react'
import {selectCues} from '../selectors'
import {isEqual} from 'lodash'
import {useVideo} from '../context/video-context'

/**
 * This is a wrapper around xStates useSelector because we want to have
 * a "better" comparison using lodash's isEqual which does a deeper compare
 * between the prev/next values of the cues array from our selectCues
 * selector
 */
export const useMetadataCues = () => {
  const videoService = useVideo()
  return useSelector(videoService, selectCues, (prev, next) =>
    isEqual(prev, next),
  )
}
