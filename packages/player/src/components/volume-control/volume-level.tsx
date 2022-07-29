import * as React from 'react'
import cx from 'classnames'

export const VolumeLevel: React.FC<React.PropsWithChildren<any>> = ({
  vertical = false,
  percentage = '100%',
  className,
}) => {
  const style: any = {}
  if (vertical) {
    style.height = percentage
  } else {
    style.width = percentage
  }

  return (
    <div
      className={cx(className, 'cueplayer-react-volume-level')}
      style={style}
    >
      <span className="cueplayer-react-control-text" />
    </div>
  )
}
