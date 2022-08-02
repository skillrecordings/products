import * as React from 'react'
import cx from 'classnames'

export const TimeDivider: React.FC<React.PropsWithChildren<any>> = ({
  separator = '/',
  className,
}) => {
  return (
    <div
      className={cx(
        'cueplayer-react-time-control cueplayer-react-time-divider',
        className,
      )}
      dir="ltr"
    >
      <div>
        <span>{separator}</span>
      </div>
    </div>
  )
}
