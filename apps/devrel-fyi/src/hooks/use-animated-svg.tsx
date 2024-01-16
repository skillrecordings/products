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

    let animationInterval: NodeJS.Timeout | undefined
    const delayInterval = setInterval(() => {
      // Clear previous animation interval
      if (animationInterval) {
        clearInterval(animationInterval)
      }

      // Start new animation interval
      animationInterval = setInterval(() => {
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

      // Stop animation after a couple of seconds
      setTimeout(() => {
        if (animationInterval) {
          clearInterval(animationInterval)
        }
      }, 5000) // Change this value to control how long the animation lasts
    }, Math.floor(Math.random() * (5000 - 2000 + 1)) + 1000) // Random delay between 1 and 3 seconds

    return () => {
      clearInterval(delayInterval)
      if (animationInterval) {
        clearInterval(animationInterval)
      }
    }
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
