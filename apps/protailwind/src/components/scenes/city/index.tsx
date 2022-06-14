import React, {useRef} from 'react'
import {Canvas} from '@react-three/fiber'
import {BlendFunction} from 'postprocessing'
import {OrbitControls} from '@react-three/drei'
import {useReducedMotion} from 'framer-motion'
import {Leva, useControls} from 'leva'
import {MathUtils} from 'three'
import {
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  Noise,
} from '@react-three/postprocessing'
import Particles from 'components/scenes/city/particles'
import CityModel from 'components/scenes/city/model'
import Camera from './camera'

type SceneProps = {
  camera?: React.ReactElement
  className?: string
}

const Scene: React.FC<SceneProps> = ({
  camera = <Camera />,
  className = 'w-full h-screen absolute',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any>()
  const mouse = useRef([0, 0])

  const isMobile =
    typeof window !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

  const isProduction = process.env.NODE_ENV === 'production'
  const enableOrbitControls = false
  const shouldReduceMotion = useReducedMotion()

  const {
    brightness,
    contrast,
    hue,
    saturation,
    autoRotate,
    autoRotateSpeed,
    particlesCount,
    cursorLight,
    backgroundColor,
    modelColor,
  } = useControls({
    cursorLight: !isMobile,
    autoRotate: shouldReduceMotion ? false : true,
    backgroundColor: '#0F172A',
    modelColor: '#1F2738',
    autoRotateSpeed: {
      value: -0.1,
      min: -1,
      max: 1,
      step: 0.1,
    },
    brightness: {
      value: 0,
      min: -1,
      max: 1,
      step: 0.1,
    },
    contrast: {
      value: 0,
      min: -1,
      max: 1,
      step: 0.1,
    },
    hue: {
      value: 0,
      min: 0,
      max: Math.PI,
      step: 0.1,
    },
    saturation: {
      value: 0,
      min: 0,
      max: Math.PI,
      step: 0.1,
    },
    particlesCount: {
      value: 1000,
      min: 500,
      max: 10000,
      step: 100,
    },
  })
  const cameraRef = React.useRef(null)

  return (
    <div className={className}>
      <Leva hidden={isProduction} collapsed={true} />
      <Canvas
        camera={cameraRef as any}
        resize={{scroll: false, offsetSize: true}}
        dpr={[1, 2]}
        ref={canvasRef}
        // legacy
        linear
      >
        {camera}
        <OrbitControls
          enableZoom={enableOrbitControls}
          enableRotate={enableOrbitControls}
          enablePan={enableOrbitControls}
          autoRotateSpeed={autoRotateSpeed}
          autoRotate={autoRotate}
          maxPolarAngle={Math.PI / 2.1}
        />
        <fog attach="fog" args={[backgroundColor, 50, 200]} />
        <color attach="background" args={[backgroundColor]} />
        <EffectComposer multisampling={8} autoClear={false}>
          <HueSaturation hue={hue} saturation={saturation} />
          <BrightnessContrast brightness={brightness} contrast={contrast} />
          <DepthOfField
            focusDistance={0}
            focalLength={0.4}
            bokehScale={30}
            height={480}
            width={480}
          />
          <Noise opacity={0.15} blendFunction={BlendFunction.SOFT_LIGHT} />
        </EffectComposer>
        <ambientLight
          castShadow
          intensity={1.3}
          color="#4D5B7B"
          position={[0, 20, 120]}
        />
        <spotLight
          castShadow
          intensity={0.2}
          color="#fff"
          position={[0, 20, 120]}
        />
        <spotLight
          castShadow
          intensity={0.24}
          color="#fff"
          position={[0, 80, 200]}
        />
        <React.Suspense fallback={null}>
          <CityModel color={modelColor} />
        </React.Suspense>
        <Particles
          ref={particlesRef}
          count={particlesCount}
          mouse={mouse}
          cursorLight={cursorLight}
        />
        <Plane backgroundColor={backgroundColor} />
      </Canvas>
    </div>
  )
}

export default Scene

type PlaneProps = {
  backgroundColor: string
}

const Plane: React.FC<PlaneProps> = ({backgroundColor}) => {
  return (
    <mesh position={[0, -0.2, 0]} rotation={[MathUtils.degToRad(-90), 0, 0]}>
      <planeBufferGeometry args={[500, 500]} />
      <meshStandardMaterial color={backgroundColor} />
    </mesh>
  )
}
