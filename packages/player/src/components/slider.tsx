import * as React from 'react'
import cx from 'classnames'
import {ReactNode, MouseEvent, SyntheticEvent} from 'react'

type SliderProps = {
  sliderActive?: (event?: Event | SyntheticEvent) => boolean
  sliderInactive?: (event?: Event | SyntheticEvent) => boolean
  onMouseDown?: (event: Event | SyntheticEvent) => void
  onMouseMove?: (event: Event | SyntheticEvent) => void
  onMouseUp?: (event: Event | SyntheticEvent) => void
  onFocus?: (event?: Event | SyntheticEvent) => void
  onBlur?: (event?: Event | SyntheticEvent) => void
  onClick?: (event?: Event | SyntheticEvent) => void
  getPercent?: () => number
  stepForward?: () => void
  stepBack?: () => void
  vertical?: boolean
  className?: string
  label?: string
  valuenow?: string
  valuetext?: string
  ref?: any
}

export const Slider: React.FC<SliderProps> = React.forwardRef<
  HTMLDivElement,
  SliderProps
>((props, ref) => {
  const [active, setActive] = React.useState(false)
  const {onMouseMove, onMouseUp, sliderInactive, stepForward, stepBack} = props

  //EVENT HANDLERS

  function handleMouseDown(event: Event | SyntheticEvent) {
    const {onMouseDown} = props
    // event.preventDefault();
    // event.stopPropagation();

    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('mouseup', handleMouseUp, true)
    document.addEventListener('touchmove', handleMouseMove, true)
    document.addEventListener('touchend', handleMouseUp, true)

    setActive(true)

    if (props.sliderActive) {
      props.sliderActive(event)
    }

    handleMouseMove(event)

    if (onMouseDown) {
      onMouseDown(event)
    }
  }

  const handleMouseMove = React.useCallback(
    (event: Event | SyntheticEvent) => {
      if (onMouseMove) {
        onMouseMove(event)
      }
    },
    [onMouseMove],
  )

  const handleMouseUp = React.useCallback(
    (event: Event) => {
      // On iOS safari, a subsequent mouseup event will be fired after touchend.
      // Its weird event positions make the player seek a wrong time.
      // calling preventDefault (at touchend phase) will prevent the mouseup event
      event.preventDefault()

      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('mouseup', handleMouseUp, true)
      document.removeEventListener('touchmove', handleMouseMove, true)
      document.removeEventListener('touchend', handleMouseUp, true)

      setActive(false)

      if (sliderInactive) {
        sliderInactive(event)
      }

      if (onMouseUp) {
        onMouseUp(event)
      }
    },
    [onMouseUp, sliderInactive, handleMouseMove],
  )

  function handleFocus(e: Event | SyntheticEvent) {
    document.addEventListener('keydown', handleKeyPress, true)
    if (props.onFocus) {
      props.onFocus(e)
    }
  }

  function handleBlur(e: Event | SyntheticEvent) {
    document.removeEventListener('keydown', handleKeyPress, true)
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  function handleClick(event: MouseEvent) {
    event.preventDefault()
    // event.stopPropagation();
    if (props.onClick) {
      props.onClick(event)
    }
  }

  const handleStepForward = React.useCallback(() => {
    if (stepForward) {
      stepForward()
    }
  }, [stepForward])

  const handleStepBack = React.useCallback(() => {
    if (stepBack) {
      stepBack()
    }
  }, [stepBack])

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.which === 37 || event.which === 40) {
        // Left and Down Arrows
        event.preventDefault()
        event.stopPropagation()
        handleStepBack()
      } else if (event.which === 38 || event.which === 39) {
        // Up and Right Arrows
        event.preventDefault()
        event.stopPropagation()
        handleStepForward()
      }
    },
    [handleStepBack, handleStepForward],
  )

  function getProgress() {
    const {getPercent} = props
    if (!getPercent) {
      return 0
    }
    let progress = getPercent()

    // Protect against no duration and other division issues
    if (progress < 0 || progress === Infinity) {
      progress = 0
    }
    return progress
  }

  function renderChildren() {
    const progress = getProgress()
    const percentage = `${(progress * 100).toFixed(2)}%`
    return React.Children.map<ReactNode, ReactNode>(props.children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {progress, percentage})
      }
    })
  }

  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('mouseup', handleMouseUp, true)
      document.removeEventListener('touchmove', handleMouseMove, true)
      document.removeEventListener('touchend', handleMouseUp, true)
      document.removeEventListener('keydown', handleKeyPress, true)
    }
  }, [handleKeyPress, handleMouseMove, handleMouseUp])

  return (
    <div
      className={cx(
        props.className,
        {
          'cueplayer-react-slider-vertical': props.vertical,
          'cueplayer-react-slider-horizontal': !props.vertical,
          'cueplayer-react-sliding': active,
        },
        'cueplayer-react-slider',
      )}
      ref={ref}
      tabIndex={0}
      role="slider"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      aria-label={props.label || ''}
      aria-valuenow={Number(props.valuenow) || 0}
      aria-valuetext={props.valuetext || ''}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {renderChildren()}
    </div>
  )
})
