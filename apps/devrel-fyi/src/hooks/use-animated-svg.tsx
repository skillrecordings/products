import React from 'react'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'

export const useAnimatedSVG = ({
  paths,
  asGroups,
  mirror,
  delayBetweenFrames = 250,
}: {
  paths: string[] | any[]
  asGroups?: boolean
  mirror?: boolean
  delayBetweenFrames?: number
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentIndex(paths.length - 1)
      return
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (mirror) {
          let newDirection = direction
          let newIndex = prevIndex + newDirection
          if (newIndex >= paths.length || newIndex < 0) {
            newDirection = -direction
            newIndex = prevIndex + newDirection
          }
          setDirection(newDirection)
          return newIndex
        } else {
          return (prevIndex + 1) % paths.length
        }
      })
    }, delayBetweenFrames)

    return () => clearInterval(interval)
  }, [paths.length, direction])

  const AnimatedPath = () => (
    <AnimatePresence>
      {asGroups ? (
        <motion.g key={currentIndex}>{paths[currentIndex]}</motion.g>
      ) : (
        <motion.path
          key={currentIndex}
          d={paths[currentIndex]}
          fill="currentColor"
        />
      )}
    </AnimatePresence>
  )

  return AnimatedPath
}
