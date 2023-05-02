import React from 'react'
import {
  type ValueAnimationTransition,
  animate,
  mix,
  motion,
  useAnimate,
  useCycle,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion'

const useAnimatedColor = (speed?: number) => {
  const transition: ValueAnimationTransition = {
    duration: speed || 30,
    repeat: Infinity,
    repeatType: 'mirror',
  }

  const startColor = 'hsl(0, 82%, 74%)'
  const endColor = 'hsl(360, 82%, 74%)'
  const [backgroundColor, cycleColor] = useCycle(startColor, endColor)

  // Emulating Framer Motion < 5.2 HSLA interpolation
  const progress = useMotionValue(0)
  const animatedColor = useTransform(progress, (latest) => {
    const hue = mix(0, 360, latest)
    const saturation = mix(82, 82, latest)
    const lightness = mix(50, 50, latest)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  })
  React.useEffect(() => {
    // animate(progress, backgroundColor === endColor ? 1 : 0, transition)
    animate(progress, 1, transition)
  }, [])

  return animatedColor
}

export {useAnimatedColor}
