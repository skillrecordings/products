import React from 'react'
import {StarField} from 'starfield-react'
import {useWindowSize} from 'react-use'
import {useReducedMotion} from 'framer-motion'

const Starfield: React.FC<any> = ({speed}) => {
  const {width, height} = useWindowSize()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 -z-10 overflow-hidden w-full h-full pointer-events-none select-none"
    >
      {mounted && (
        <StarField
          fps={60}
          width={width}
          height={height}
          speed={shouldReduceMotion ? 0 : speed}
          noBackground
        />
      )}
    </div>
  )
}

export default Starfield
