import * as React from 'react'
import cx from 'classnames'
import {ForwardedRef, FocusEvent, MouseEvent, KeyboardEvent} from 'react'

type ClickableComponentProps = {
  tagName: string
  className?: string
  onClick: (event: MouseEvent | KeyboardEvent | Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  ref: ForwardedRef<HTMLDivElement>
}

export const ClickableComponent: React.FC<ClickableComponentProps> =
  React.forwardRef<HTMLDivElement, ClickableComponentProps>(
    ({className, ...props}, ref) => {
      function handleKeypress(event: KeyboardEvent | Event) {
        // Support Space (32) or Enter (13) key operation to fire a click event
        // @ts-ignore
        if (event.which && (event.which === 32 || event.which === 13)) {
          event.preventDefault()
          handleClick(event)
        }
      }

      function handleClick(event: MouseEvent | KeyboardEvent | Event) {
        const {onClick} = props
        onClick(event)
      }

      function handleFocus(e: FocusEvent) {
        document.addEventListener('keydown', handleKeypress)
        if (props.onFocus) {
          props.onFocus(e)
        }
      }

      function handleBlur(e: FocusEvent) {
        document.removeEventListener('keydown', handleKeypress)
        if (props.onBlur) {
          props.onBlur(e)
        }
      }

      React.useEffect(() => {
        return () => {
          document.removeEventListener('keydown', handleKeypress)
        }
      })

      return (
        <div
          {...props}
          ref={ref}
          className={cx(className)}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )
    },
  )
