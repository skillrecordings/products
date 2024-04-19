import * as React from 'react'
import {motion} from 'framer-motion'
import {cn} from '@skillrecordings/ui/utils/cn'

const ProgressBar: React.FC<{percentComplete: number}> = ({
  percentComplete = 0,
}) => {
  return (
    <div className="relative flex h-full w-40 max-w-xs items-center lg:max-w-md lg:flex-row">
      <div className="text-xxs mb-0 mr-2 flex items-center justify-center uppercase text-gray-500">
        <span className="-mt-px inline-block text-xs font-semibold text-er-gray-900">
          {percentComplete}%
        </span>
      </div>
      <div className="relative h-1 w-full max-w-lg rounded-full bg-gray-300">
        <motion.div
          animate={{width: `${percentComplete}%`}}
          initial={{width: `${percentComplete}%`}}
          transition={{duration: 0.5, type: 'spring', mass: 0.5}}
          className="h-1 bg-blue-500 transition-transform duration-75 ease-in-out"
        />
        <div
          className={cn(
            'absolute left-[99%] -mt-3 h-5 w-5 rounded-full border-2 bg-background',
            percentComplete === 100 ? 'border-blue-500' : 'border-er-gray-300',
          )}
        />
      </div>
    </div>
  )
}

export default ProgressBar
