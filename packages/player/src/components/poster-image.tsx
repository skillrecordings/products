import * as React from 'react'
import {VideoContext} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectHasStarted, selectIsPaused} from './player'
import cx from 'classnames'

type PosterImageType = {
  poster: string
  className?: string
}

export const PosterImage: React.FC<PosterImageType> = ({poster, className}) => {
  const {videoService} = React.useContext(VideoContext)
  const hasStarted = useSelector(videoService, selectHasStarted)
  const paused = useSelector(videoService, selectIsPaused)

  if (!poster || hasStarted) {
    return null
  }

  return (
    <div
      className={cx('cueplayer-react-poster', className)}
      style={{
        backgroundImage: `url("${poster}")`,
      }}
      onClick={() => {
        if (paused) {
          videoService.send('PLAY')
        }
      }}
    />
  )
}
