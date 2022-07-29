import * as React from 'react'
import {ClickableComponent} from '../core/clickable-component'
import cx from 'classnames'
import {Popup} from './popup'

export const PopupButton: React.FC<React.PropsWithChildren<any>> = (props) => {
  const {className, inline = true, children, ...ps} = props
  return (
    <ClickableComponent
      className={cx(
        className,
        {
          'cueplayer-react-menu-button-inline': !!inline,
          'cueplayer-react-menu-button-popup': !inline,
        },
        'cueplayer-react-control cueplayer-react-button cueplayer-react-menu-button',
      )}
      {...ps}
    >
      <Popup {...props} />
    </ClickableComponent>
  )
}
