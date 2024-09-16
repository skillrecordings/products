'use client'
import React from 'react'
import {StarField} from 'starfield-react'
import {useWindowSize} from 'react-use'
import {useReducedMotion} from 'framer-motion'
import cx from 'classnames'

const Starfield: React.FC<{speed?: number; className?: string}> = ({
  speed = 0.5,
  className,
}) => {
  const {width, height} = useWindowSize()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cx(
        'pointer-events-none fixed left-0 top-0 h-full w-full select-none overflow-hidden opacity-75',
        className,
      )}
    >
      {mounted && (
        <StarField
          fps={60}
          width={width}
          height={height}
          speed={shouldReduceMotion ? 0 : speed}
          noBackground
        />
      )}
    </div>
  )
}

export default Starfield
