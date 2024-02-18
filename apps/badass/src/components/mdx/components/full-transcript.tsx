import * as React from 'react'
import {motion} from 'framer-motion'

const FullTranscript: React.FC<React.PropsWithChildren> = ({children}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)
  const [maxHeight, setMaxHeight] = React.useState<number>(640)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  React.useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setMaxHeight(400)
      } else {
        setMaxHeight(640)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div data-full-transcript="">
      <motion.div
        data-full-transcript-wrapper=""
        data-full-transcript-overlay={!isExpanded}
        initial={{height: maxHeight}}
        animate={{height: isExpanded ? 'auto' : maxHeight}}
        transition={{duration: 0.3, ease: 'easeInOut'}}
      >
        {children}
      </motion.div>
      <button data-read-full-transcript-button="" onClick={toggleExpand}>
        {isExpanded ? 'Collapse' : 'Read Full Transcript'}
      </button>
    </div>
  )
}

export default FullTranscript
