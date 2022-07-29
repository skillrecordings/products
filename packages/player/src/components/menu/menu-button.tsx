import * as React from 'react'
import cx from 'classnames'
import {ClickableComponent} from '../core/clickable-component'
import {Menu} from './menu'
import {MenuItem} from './menu-item'

export const MenuButton: React.FC<React.PropsWithChildren<any>> = (props) => {
  const [active, setActive] = React.useState(false)
  const {selected} = props
  const [activateIndex, setActivateIndex] = React.useState(selected || 0)
  const {inline, className} = props
  const menuButtonRef = React.useRef(null)

  React.useEffect(() => {
    activateMenuItem(selected)
  }, [selected])

  function handleIndexChange(index: number) {
    const {onSelectItem} = props
    onSelectItem(index)
  }

  function commitSelection(index: number) {
    setActivateIndex(index)
    handleIndexChange(index)
  }

  function handleSelectItem(i: number) {
    commitSelection(i)
  }

  function handleClick() {
    setActive((prevActive) => !prevActive)
  }

  function handleFocus() {
    document.addEventListener('keydown', handleKeyPress)
  }

  function handleBlur() {
    setActive(false)
    document.removeEventListener('keydown', handleKeyPress)
  }

  function activateMenuItem(index: number) {
    setActivateIndex(index)
    handleIndexChange(index)
  }

  function handleUpArrow(e: KeyboardEvent) {
    const {items} = props
    if (active) {
      e.preventDefault()
      let newIndex = activateIndex - 1
      if (newIndex < 0) {
        newIndex = items.length ? items.length - 1 : 0
      }
      activateMenuItem(newIndex)
    }
  }

  function handleDownArrow(e: KeyboardEvent) {
    const {items} = props
    if (active) {
      e.preventDefault()
      let newIndex = activateIndex + 1
      if (newIndex >= items.length) {
        newIndex = 0
      }
      activateMenuItem(newIndex)
    }
  }

  function handleTab(e: KeyboardEvent) {
    if (active) {
      e.preventDefault()
      commitSelection(activateIndex)
    }
  }

  function handleReturn(e: KeyboardEvent) {
    e.preventDefault()
    if (active) {
      commitSelection(activateIndex)
    } else {
      setActive(true)
    }
  }

  function handleEscape() {
    setActive(false)
    setActivateIndex(0)
  }

  function handleKeyPress(event: KeyboardEvent) {
    // Escape (27) key
    if (event.which === 27) {
      handleEscape()
    } else if (event.which === 9) {
      // Tab (9) key
      handleTab(event)
    } else if (event.which === 13) {
      // Enter (13) key
      handleReturn(event)
    } else if (event.which === 38) {
      // Up (38) key
      handleUpArrow(event)
    } else if (event.which === 40) {
      // Down (40) key press
      handleDownArrow(event)
    }
  }

  function renderMenu() {
    if (!active) {
      return null
    }

    const {items} = props
    return (
      <Menu>
        {items.map((item: string, i: number) => (
          <MenuItem
            item={item}
            index={i}
            onSelectItem={handleSelectItem}
            activateIndex={activateIndex}
            key={`item-${i++}`}
          />
        ))}
      </Menu>
    )
  }

  return (
    <ClickableComponent
      className={cx(
        className,
        {
          'cueplayer-react-menu-button-inline': !!inline,
          'cueplayer-react-menu-button-popup': !inline,
          'cueplayer-react-menu-button-active': active,
        },
        'cueplayer-react-control cueplayer-react-button cueplayer-react-menu-button',
      )}
      role="button"
      tabIndex={0}
      ref={menuButtonRef}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {props.children}
      {renderMenu()}
    </ClickableComponent>
  )
}
