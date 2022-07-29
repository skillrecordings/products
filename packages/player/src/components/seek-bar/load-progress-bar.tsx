import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {selectBuffered, selectDuration} from '../../selectors'
import {SliderMarker} from '@reach/slider'

export const LoadProgressBar: React.FC<React.PropsWithChildren<any>> = ({
  className,
}) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)
  const buffered = useSelector(videoService, selectBuffered)

  if (!buffered || !buffered.length) {
    return null
  }
  let bufferedEnd = buffered.end(buffered.length - 1)

  if (bufferedEnd > duration) {
    bufferedEnd = duration
  }

  // get the percent width of a time compared to the total end
  function percentify(time: number, end: number) {
    const percent = time / end || 0 // no NaN
    return (percent >= 1 ? 1 : percent) * 100
  }

  // the width of the progress bar
  const style = {width: '0%'}
  style.width = `${percentify(bufferedEnd, duration)}%`

  let parts: any[] | undefined = []

  // add child elements to represent the individual buffered time ranges
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i)
    const end = buffered.end(i)
    // set the percent based on the width of the progress bar (bufferedEnd)
    const part = (
      <SliderMarker
        value={percentify(start, bufferedEnd)}
        style={{
          width: percentify(end - start, bufferedEnd) + '%',
        }}
        key={`part-${i}`}
      />
    )
    parts.push(part)
  }

  if (parts.length === 0) {
    parts = undefined
  }

  return (
    <div
      style={style}
      className={cx('cueplayer-react-load-progress', className)}
    >
      <span className="cueplayer-react-control-text">
        Loaded: {percentify(bufferedEnd, duration).toFixed(0)}%
      </span>
      {parts}
    </div>
  )
}
