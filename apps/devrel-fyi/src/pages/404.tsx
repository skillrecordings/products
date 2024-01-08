import React from 'react'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {motion as motion3d} from 'framer-motion-3d'
import {Icosahedron, Text, useTexture, Decal} from '@react-three/drei'
import * as THREE from 'three'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {motion} from 'framer-motion'
import {useMedia} from 'react-use'
import Layout from '@/components/app/layout'
import Container from '@/components/app/container'

const NotFound = () => {
  return (
    <Layout>
      <Container
        as="header"
        className="relative flex min-h-[calc(100svh-80px)] flex-col items-center justify-center overflow-hidden px-0 text-center sm:space-y-10 lg:px-0"
      >
        <Hero />
      </Container>
    </Layout>
  )
}

const Hero = () => {
  return (
    <>
      <ThreeHero />
      <motion.h1
        animate={{
          opacity: [0, 0.95],
          y: [-50, 0],
        }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: 'easeInOut',
        }}
        initial={{
          opacity: 0,
          y: -50,
        }}
        className="pointer-events-none relative z-10 whitespace-nowrap text-center text-6xl sm:text-7xl md:sr-only lg:text-8xl"
      >
        404
      </motion.h1>
    </>
  )
}

const ThreeHero = () => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isMdScreen = useMedia('(min-width: 768px)')
  return mounted ? (
    <motion.div
      className="absolute left-0 top-0 h-full w-full"
      animate={{opacity: [0, 1]}}
      initial={{opacity: 0}}
      transition={{
        duration: 1,
        delay: 0.1,
        ease: 'easeInOut',
      }}
    >
      <Canvas
        camera={{position: [0, 0, 5], fov: 50}}
        gl={{antialias: true}}
        dpr={isBrowser() ? window.devicePixelRatio : 1}
        style={{
          height: '100%',
          position: 'absolute',
          background: '#000',
        }}
        shadows
      >
        <Object />
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.7}
          position={[20, 10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <spotLight
          intensity={0.2}
          position={[-20, -10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        {isMdScreen && (
          <>
            <motion3d.group
              receiveShadow
              animate={{
                opacity: [0, 0.95],
                y: [0.2, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: 'easeInOut',
              }}
              initial={{
                opacity: 0,
                y: 0.2,
              }}
              position={[0, 0, -0.4]}
            >
              <Text
                // color="white"
                material={new THREE.MeshStandardMaterial({color: '#fafafa'})}
                receiveShadow
                fillOpacity={0.9}
                fontSize={0.8}
                font={'/fonts/378efe47-19c4-4140-a227-728b09adde45.woff'}
                position={[0, 0.3, 0]}
              >{`404`}</Text>
            </motion3d.group>
            <motion3d.group
              position={[0, 0, -0.4]}
              animate={{
                opacity: [0, 1],
                y: [-0.15, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.4,
                ease: 'easeInOut',
              }}
              initial={{
                opacity: 0,
                y: -0.15,
              }}
            >
              <Text
                material={new THREE.MeshStandardMaterial({color: '#1FD073'})}
                receiveShadow
                font={'/fonts/fcf3fad0-df0b-4a20-9c50-e5748f25a15d.woff'}
                fillOpacity={1}
                fontSize={0.08}
                position={[0, -0.45, 0]}
              >
                {'Not Found'}
              </Text>
            </motion3d.group>
          </>
        )}
        <mesh receiveShadow position={[0, 0, -0.42]}>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#171717" />
        </mesh>
      </Canvas>
    </motion.div>
  ) : null
}

function Object() {
  const {viewport, scene, size} = useThree()
  const targetPosition = [0, 0, 0]
  const targetRotation = [0, 0, 0]
  const smoothFactor = 0.1 // Adjust this value to control the smoothness

  const ref = React.useRef<any>(null)

  useFrame(({mouse}) => {
    if ((mouse.x === 0 && mouse.y === 0) || !mouse) {
      ref.current.position.x = viewport.width / 2.3
      ref.current.position.y = viewport.height / 2.7
    }
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    // Smoothly interpolate the position and rotation
    ref.current.position.x += (x - ref.current.position.x) * smoothFactor
    ref.current.position.y += (y - ref.current.position.y) * smoothFactor

    ref.current.rotation.x += (-y * 1.5 - ref.current.rotation.x) * smoothFactor
    ref.current.rotation.y += (x * 1.5 - ref.current.rotation.y) * smoothFactor
  })

  // const texture = useTexture('/icosahedron-texture.png')

  return (
    <>
      <motion3d.group
        ref={ref}
        animate={{
          opacity: [0, 1],
        }}
        transition={{
          duration: 1,
          delay: 2,
          ease: 'easeInOut',
        }}
        initial={{
          opacity: 0,
        }}
      >
        <Icosahedron castShadow receiveShadow args={[0.6]}>
          <meshStandardMaterial attach="material" color="#2B2B2B" />
          <Decal
            debug={false}
            castShadow
            receiveShadow
            polygonOffsetFactor={-1}
            position={[0, 0, 0.5]}
            rotation={[0, 0, 0]}
            scale={[1, 0.5, 0.5]}
            geometry={new THREE.IcosahedronGeometry(0.6, 0)}
          >
            <meshStandardMaterial
              // map={texture}
              color="#2B2B2B"
            />
          </Decal>
        </Icosahedron>
      </motion3d.group>
    </>
  )
}

export default NotFound
