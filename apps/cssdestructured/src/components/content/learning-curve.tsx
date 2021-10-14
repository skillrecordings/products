import React from 'react'
import {motion} from 'framer-motion'
import {useIntersectionObserver} from 'react-intersection-observer-hook'

const LearningCurve = () => {
  const [ref, {entry}] = useIntersectionObserver()
  const isIntersecting = entry && entry.isIntersecting
  const [isVisible, setVisible] = React.useState<boolean>(false)
  React.useEffect(() => {
    isIntersecting && setVisible(true)
  }, [isIntersecting])

  return (
    <div className="py-1">
      <figure ref={ref} className="sm:p-10 p-5 m-8 relative">
        <div className="w-px h-full bg-brand-cream bg-opacity-50 absolute left-0 top-0 flex items-center justify-center text-center">
          <figcaption className="mb-5 -rotate-90 mr-10">learning</figcaption>
        </div>
        <div className="w-full h-px bg-brand-cream bg-opacity-50 absolute left-0 bottom-0 flex items-center justify-center text-center">
          <figcaption className="pt-5">time</figcaption>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 559 371"
        >
          <title>
            line chart representing a learning curve showing that css can be
            easy to start with, but it tends to get harder and more complex as
            you dive into deeper topics
          </title>
          <motion.path
            className="text-brand-text"
            animate={{pathLength: isVisible ? 1 : 0}}
            transition={{duration: 2.5, delay: 0.1, ease: 'easeInOut'}}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M3 370c2-81.833 26.5-193.5 56.5-193.5 45 0 40 168.5 84 168.5s67.701-48.5 79.5-74c15.5-33.5 60-194.267 140-230C443 5.267 488 7 540 2.5"
          />
        </svg>
      </figure>
    </div>
  )
}

export default LearningCurve
