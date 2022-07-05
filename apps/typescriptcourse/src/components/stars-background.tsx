import * as React from 'react'
import {Vector3, MathUtils} from 'three'
import {useReducedMotion} from 'framer-motion'
import {Stars} from '@react-three/drei'
import {Canvas, useThree, useFrame} from '@react-three/fiber'
import {isBrowser} from 'utils/is-browser'

const {degToRad, lerp} = MathUtils

const Scene = () => {
  const shouldReduceMotion = useReducedMotion()
  const {mouse} = useThree()
  const ref: any = React.useRef()
  const vec = new Vector3()
  useFrame((state, delta) => {
    if (!shouldReduceMotion) {
      state.camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, 160), 0.05)
      ref.current.rotation.y += delta * 0.01
      ref.current.rotation.x -= delta * 0.005
    }
  })
  return (
    <>
      <Stars
        ref={ref}
        radius={50}
        depth={20}
        count={7000}
        factor={4}
        saturation={0.5}
        fade={true}
      />
    </>
  )
}

const StarsBackground = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  return (
    <>
      <div className="absolute left-0 top-0 w-full h-screen bg-gray-900">
        {isMounted && (
          <Canvas
            camera={{position: [0, 0, 160]}}
            dpr={isBrowser() ? window.devicePixelRatio : 1}
            className="w-full"
          >
            <Scene />
            <color attach="background" args={['rgb(17, 24, 39)']} />
          </Canvas>
        )}
        <div className="pointer-events-none absolute left-0 top-0 w-full h-full bg-gradient-to-b from-gray-900/50 to-gray-900" />
      </div>
    </>
  )
}

export default StarsBackground
