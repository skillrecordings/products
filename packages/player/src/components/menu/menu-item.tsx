import * as React from 'react'
import cx from 'classnames'

export const MenuItem: React.FC<React.PropsWithChildren<any>> = (props) => {
  const {item, index, activateIndex} = props

  function handleClick() {
    const {index, onSelectItem} = props
    onSelectItem(index)
  }

  return (
    <li
      className={cx({
        'cueplayer-react-menu-item': true,
        'cueplayer-react-selected': index === activateIndex,
      })}
      role="menuitem"
      onClick={handleClick}
    >
      {item.label}
      <span className="cueplayer-react-control-text" />
    </li>
  )
}
