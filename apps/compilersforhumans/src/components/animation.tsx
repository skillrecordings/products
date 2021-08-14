import * as React from 'react'
import * as THREE from 'three'
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber'
import {isBrowser} from 'utils/is-browser'
import {useTheme} from 'next-themes'
import {shaderMaterial} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import {useReducedMotion} from 'framer-motion'

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(1.0, 1.0, 1.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
      precision highp float;
      varying vec2 vUv;
      varying float vWave;
      uniform float uTime;
      #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
      void main() {
        vUv = uv;
        vec3 pos = position;
        float noiseFreq = 2.0;
        float noiseAmp = 0.2;
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        // vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise3(noisePos) * noiseAmp;
        vWave = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
      }
    `,
  // Fragment Shader
  glsl`
      precision highp float;
      uniform vec3 uColor;
      uniform float uTime;
      uniform sampler2D uTexture;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        float wave = vWave * 0.2;
        vec3 texture = texture2D(uTexture, vUv + wave).rgb; 
        gl_FragColor = vec4(texture, 1.0);
        
      }
    `,
)

extend({WaveShaderMaterial})

const position: any = [0, 0, 0]

const Scene = ({theme}: any) => {
  const shouldReduceMotion = useReducedMotion()
  const ref: any = React.useRef()
  const rotate: any = React.useRef()
  const randomFrame: Number = Math.floor(Math.random() * 60)
  useFrame(
    ({clock}) =>
      (ref.current.uTime = !shouldReduceMotion
        ? clock.getElapsedTime() / 5
        : randomFrame),
  )
  useFrame(() => {
    rotate.current.rotation.x = Math.sin(40)
    rotate.current.rotation.y = Math.sin(-40)
  })

  const [darkImage] = useLoader(THREE.TextureLoader, [
    '/gradient-dark-optimized.jpg',
  ])

  const [lightImage] = useLoader(THREE.TextureLoader, [
    '/gradient-light-optimized.jpg',
  ])

  return (
    <>
      <mesh ref={rotate} position={position}>
        <sphereGeometry args={[0.3, 100, 100]} attach="geometry" />
        {/* @ts-ignore */}
        <waveShaderMaterial
          uColor={'pink'}
          uTexture={theme === 'dark' ? darkImage : lightImage}
          ref={ref}
        />
      </mesh>
    </>
  )
}

const Animation: React.FC<{className?: string}> = ({className = ''}) => {
  const {resolvedTheme: theme} = useTheme()
  return (
    <Canvas
      camera={{fov: 12, position: [0, 0, 5]}}
      className={className}
      dpr={isBrowser() ? window.devicePixelRatio : 1}
    >
      <ambientLight intensity={2.5} />
      <React.Suspense fallback={null}>
        <Scene theme={theme} />
      </React.Suspense>
    </Canvas>
  )
}

export default Animation
