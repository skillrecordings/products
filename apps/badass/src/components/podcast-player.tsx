import * as React from 'react'
import {motion} from 'framer-motion'

const PodcastPlayer: React.FC<{simplecastId: string}> = ({simplecastId}) => {
  const [state, setState] = React.useState({loading: true})
  return (
    <div className="relative">
      {state.loading && (
        <motion.div
          animate={{
            opacity: [0.1, 1, 0.1],
          }}
          transition={{duration: 2, loop: Infinity}}
          className="w-full absolute top-0 rounded-md bg-gray-200 overflow-hidden"
          style={{height: 200}}
        >
          <motion.div
            className="w-40 rounded-full h-full bg-gray-300 absolute"
            animate={{left: ['0%', '100%']}}
            transition={{duration: 2, loop: Infinity}}
            style={{filter: 'blur(80px)'}}
          />
        </motion.div>
      )}

      <iframe
        onLoad={() => setState({loading: false})}
        className="my-8"
        height="200px"
        width="100%"
        frameBorder="no"
        scrolling="no"
        seamless
        src={`https://player.simplecast.com/${simplecastId}?dark=true&color=162238`}
      />
    </div>
  )
}

export default PodcastPlayer
