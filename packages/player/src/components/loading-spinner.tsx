import * as React from 'react'
import {VideoContext} from '../context/video-context'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {selectHasFailed} from '../selectors'

type LoadingSpinnerType = {
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerType> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const error = useSelector(videoService, selectHasFailed)

  if (error) {
    return null
  }

  return <div className={cx('cueplayer-react-loading-spinner', className)} />
}
