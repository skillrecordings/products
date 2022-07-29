import * as React from 'react'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {selectHasFailed} from '../selectors'

type LoadingSpinnerType = {
  className?: string
}

export const LoadingSpinner: React.FC<
  React.PropsWithChildren<LoadingSpinnerType>
> = ({className}) => {
  const videoService = useVideo()
  const error = useSelector(videoService, selectHasFailed)

  if (error) {
    return null
  }

  return <div className={cx('cueplayer-react-loading-spinner', className)} />
}
