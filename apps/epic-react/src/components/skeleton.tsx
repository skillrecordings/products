import {motion} from 'framer-motion'

export default function Skeleton(props: any) {
  return (
    <motion.div
      className={`relative h-5 overflow-hidden rounded-md bg-gray-300 ${
        props.className ? props.className : 'w-full'
      }`}
      animate={{
        opacity: [0.1, 1, 0.1],
      }}
      transition={{duration: 2, loop: Infinity}}
    >
      <motion.div
        className="absolute h-5 w-24 bg-gray-400"
        animate={{left: ['0%', '100%']}}
        transition={{duration: 2, loop: Infinity}}
        style={{filter: 'blur(20px)'}}
      />
    </motion.div>
  )
}
