import {cn} from '@skillrecordings/ui/utils/cn'
import {motion} from 'framer-motion'

const Divider = ({className = ''}: {className?: string}) => (
  <>
    <motion.div
      className={cn(
        `mx-auto w-10 overflow-hidden rounded-lg text-react`,
        className,
      )}
      initial={{opacity: 0, y: 0}}
      animate={{opacity: 1, y: 0}}
      transition={{type: 'spring', mass: 0.2, damping: 80, delay: 0.2}}
    >
      <motion.svg
        animate={{x: [0, -16]}}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1.5,
          ease: 'linear',
        }}
        className="mx-auto w-24"
        width="123"
        height="16"
        viewBox="0 0 123 16"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          points="652.5 379 662.5 369 672.5 379 682.5 369 692.5 379 702.5 369 712.5 379 722.5 369 732.5 379 742.5 369 752.5 379 762.5 369 772.5 379"
          transform="translate(-651 -366)"
        />
      </motion.svg>
    </motion.div>
  </>
)

export default Divider
