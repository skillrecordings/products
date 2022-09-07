import React from 'react'
import {StarField} from 'starfield-react'
import {useWindowSize} from 'react-use'

const Starfield: React.FC<any> = ({speed}) => {
  const {width, height} = useWindowSize()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

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
          speed={speed}
          noBackground
        />
      )}
    </div>
  )
}

export default Starfield
