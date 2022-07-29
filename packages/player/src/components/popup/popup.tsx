import * as React from 'react'
import {SyntheticEvent} from 'react'

export const Popup: React.FC<React.PropsWithChildren<any>> = ({children}) => {
  function handleClick(event: SyntheticEvent) {
    event.preventDefault()
    // event.stopPropagation();
  }

  return (
    <div className="cueplayer-react-menu" onClick={handleClick}>
      <div className="cueplayer-react-menu-content">{children}</div>
    </div>
  )
}
