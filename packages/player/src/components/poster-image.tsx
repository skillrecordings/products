import * as React from 'react'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {selectHasStarted, selectIsPaused} from '../selectors'

type PosterImageType = {
  poster: string
  className?: string
}

export const PosterImage: React.FC<
  React.PropsWithChildren<PosterImageType>
> = ({poster, className}) => {
  const videoService = useVideo()
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
