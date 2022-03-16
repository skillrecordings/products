import * as React from 'react'
import * as THREE from 'three'
import {
  Box,
  OrbitControls,
  RoundedBox,
  Sphere,
  Stars,
  Text,
} from '@react-three/drei'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {motion} from 'framer-motion-3d'
import {useMotionValue, useViewportScroll} from 'framer-motion'
import {useWindowScroll} from 'react-use'
import {degToRad} from 'three/src/math/MathUtils'

const Scene = () => {
  const {y} = useWindowScroll()
  const boxRef = React.useRef(null)
  useFrame(({camera}) => {
    camera.position.set(0, y / 100, -y / 200)
    camera.rotation.set(deg2rad(-y / 20), 0, 0)
  })
  return (
    <>
      <Stars
        radius={100} // Radius of the inner sphere (default=100)
        depth={100} // Depth of area where stars should fit (default=50)
        count={7000} // Amount of stars (default=5000)
        factor={4} // Size factor (default=4)
        saturation={0.5} // Saturation 0-1 (default=0)
        fade={true} // Faded dots (default=false)
      />
      <Box
        ref={boxRef}
        position={[0, -4.5, -5]}
        args={[1.5, 1.5, 8]}
        rotation={[degToRad(95), 0, Math.PI / 4]}
        receiveShadow
      >
        <meshPhongMaterial attach="material" color="rgb(37, 99, 235)" />
      </Box>
      {/* <Text
        rotation={[deg2rad(95), 0, 0]}
        position={[0, 0, -2]}
        fontSize={0.8}
        color="white"
      >
        TS
      </Text> */}
    </>
  )
}

const deg2rad = (degrees: any) => degrees * (Math.PI / 180)

const HeaderComponent = () => {
  return (
    <div className="absolute left-0 top-0 w-full h-screen">
      {/* <div className="absolute left-0 top-0 w-full h-full bg-gray-900" /> */}
      <Canvas
        className="w-full"
        //   colorManagement
        //   camera={{
        //     position: [0, 0, 50],
        //     fov: 75,
        //   }}
        //   shadowMap //  This seems to get the shadows worlking, combined with cast and receive shadow on meshes and lights
      >
        <React.Suspense fallback={null}>
          <camera />
          <color attach="background" args={['black']} />
          <ambientLight />
          <pointLight position={[2, 5, 2]} castShadow />
          <Scene />
        </React.Suspense>
      </Canvas>
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900" />
    </div>
  )
}

export default HeaderComponent
