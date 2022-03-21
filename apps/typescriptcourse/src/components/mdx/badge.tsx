import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'

const AnimatedBadge: React.FC<{icon?: React.ReactElement}> = ({
  children,
  icon,
}) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="mb-2 rounded-full inline-flex items-center justify-center shadow-xl">
      <motion.div
        initial={{
          backgroundImage: 'transparent',
        }}
        transition={{repeat: Infinity, duration: 3, repeatDelay: 1.6}}
        animate={
          !shouldReduceMotion && {
            backgroundImage: [
              'linear-gradient(to right, rgba(255, 255, 255, 0) -50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
              'linear-gradient(to right, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 0.6) 200%, rgba(255, 255, 255, 0) 200%)',
            ],
          }
        }
        className="items-center justify-center space-x-1 bg-white bg-opacity-5 bg-blend-overlay firefox:bg-blend-normal supports-backdrop-blur:backdrop-blur-sm supports-backdrop-blur:backdrop-brightness-125 uppercase text-xs font-semibold tracking-wide leading-5 rounded-full px-4 py-1.5 inline-flex"
      >
        {icon || <i className="gg-mail scale-75 opacity-75 text-blue-200" />}
        <span className="opacity-90">{children}</span>
      </motion.div>
    </div>
  )
}

export default AnimatedBadge
