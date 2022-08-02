import * as React from 'react'
import cx from 'classnames'
import {SeekBar} from './seek-bar'

export const ProgressBar: React.FC<React.PropsWithChildren<any>> = (props) => {
  return (
    <div
      className={cx(
        'cueplayer-react-progress-control cueplayer-react-progress-bar',
        props.className,
      )}
    >
      <SeekBar />
    </div>
  )
}
