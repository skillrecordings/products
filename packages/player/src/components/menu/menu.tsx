import * as React from 'react'
import cx from 'classnames'
import {SyntheticEvent} from 'react'

export const Menu: React.FC<React.PropsWithChildren<any>> = (props) => {
  function handleClick(event: SyntheticEvent) {
    event.preventDefault()
    // event.stopPropagation();
  }
  return (
    <div
      className="cueplayer-react-menu cueplayer-react-lock-showing"
      role="presentation"
      onClick={handleClick}
    >
      <ul className="cueplayer-react-menu-content">{props.children}</ul>
    </div>
  )
}
