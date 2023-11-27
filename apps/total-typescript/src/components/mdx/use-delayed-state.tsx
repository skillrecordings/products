import React, {useEffect, useState} from 'react'

export const DEFAULT_DELAY = 400

export const useDelayedState = <T,>(
  initialState: T,
  delay: number = DEFAULT_DELAY,
) => {
  const [currentState, setState] = useState(initialState)
  const [delayedState, setDelayedState] = useState(initialState)

  const timeoutRef = React.useRef<NodeJS.Timeout>()

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setDelayedState(currentState)
    }, delay)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [currentState, delay])

  return {
    delayedValue: delayedState,
    currentValue: currentState,
    set: setState,
  }
}
