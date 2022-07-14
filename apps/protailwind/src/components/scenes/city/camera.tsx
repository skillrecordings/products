import React, {useRef} from 'react'
import {useFrame, useThree} from '@react-three/fiber'
import {
  motion,
  useSpring,
  useViewportScroll,
  useTransform,
  MotionValue,
  useReducedMotion,
} from 'framer-motion'
import {MathUtils} from 'three'

// Adapted from https://github.com/pmndrs/drei/blob/master/src/core/PerspectiveCamera.tsx

type CameraProps = {
  animateOnScroll?: boolean
}

const Camera: React.FC<CameraProps> = ({animateOnScroll = true}) => {
  const set = useThree(({set}) => set)
  const camera = useThree(({camera}) => camera)
  const size = useThree(({size}) => size)
  const scene = useThree(({scene}) => scene)
  const cameraRef = useRef<any>()

  const {scrollY} = useViewportScroll()
  const yRange: MotionValue = useTransform(scrollY, [20, 700], [30, 200])
  const scroll: MotionValue = useSpring(yRange, {stiffness: 250, damping: 40})

  const shouldReduceMotion = useReducedMotion()

  useFrame(() => {
    const {current: cam} = cameraRef
    if (!shouldReduceMotion && animateOnScroll) {
      cam.position.y = scroll.get()
    }
  })

  React.useEffect(() => {
    const {current: cam} = cameraRef
    if (cam) {
      cam.aspect = size.width / size.height
      cam.updateProjectionMatrix()
    }
  }, [size])

  React.useEffect(() => {
    if (cameraRef.current) {
      const oldCam = camera
      set(() => ({camera: cameraRef.current}))
      return () => set(() => ({camera: oldCam}))
    }
  }, [camera, cameraRef, set])

  return (
    // @ts-ignore-next-line
    <motion.perspectiveCamera
      ref={cameraRef}
      position={[0, 30, 110]}
      rotation={[MathUtils.degToRad(-10), 0, 0]}
      fov={30}
    />
  )
}

export default Camera
