import * as THREE from 'three'
import React, {useRef, useMemo} from 'react'
import {useFrame, useThree} from '@react-three/fiber'

type ParticlesProps = {
  count: number
  mouse: any
  cursorLight: any
}

const Particles = React.forwardRef<any, ParticlesProps>(
  ({count, mouse, cursorLight}, ref) => {
    const mesh = useRef<any>()
    const material = useRef<any>()
    const light = useRef<any>()
    const {size, viewport} = useThree()
    const aspect = size.width / viewport.width
    const colors = [
      '#FF4D77',
      '#FFBB56',
      '#2D37F6',
      '#384461',
      '#FF4D77',
      '#2fd981',
      '#fff',
    ]
    function getRandomColor(colors: string[]) {
      return colors[Math.floor(Math.random() * colors.length)]
    }

    const dummy = useMemo(() => new THREE.Object3D(), [])
    // Generate some random positions, speed factors and timings
    const particles = useMemo(() => {
      const temp = []
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100
        const factor = 10 + Math.random() * 20
        const speed = 0.01 + Math.random() / 200
        const xFactor = -30 + Math.random() * 200
        const yFactor = -50 + Math.random() * 5
        const zFactor = -100 + Math.random() * 300
        const color = getRandomColor(colors)
        temp.push({
          t,
          factor,
          speed,
          xFactor,
          yFactor,
          zFactor,
          mx: 0,
          my: 0,
          color,
        })
      }
      return temp
    }, [count])
    // The innards of this hook will run every frame
    useFrame((state) => {
      const x = state.mouse.x * 50
      const y = state.mouse.y * 50
      // Makes the light follow the mouse
      light?.current.position.set(-y, 0, -x)
      // Run through the randomized data to calculate some movement
      particles.forEach((particle, i) => {
        let {t, factor, speed, xFactor, yFactor, zFactor, color} = particle
        // There is no sense or reason to any of this, just messing around with trigonometric functions
        t = particle.t += speed / 2
        const a = Math.cos(t) + Math.sin(t * 1) / 10
        const b = Math.sin(t) + Math.cos(t * 2) / 10
        const s = Math.cos(t)
        particle.mx += (mouse.current[0] - particle.mx) * 0.01
        particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
        // Update the dummy object
        dummy.position.set(
          (particle.mx / 10) * a +
            xFactor +
            Math.cos((t / 10) * factor) +
            (Math.sin(t * 1) * factor) / 10,
          (particle.my / 10) * b +
            yFactor +
            Math.sin((t / 10) * factor) +
            (Math.cos(t * 2) * factor) / 10,
          (particle.my / 10) * b +
            zFactor +
            Math.cos((t / 10) * factor) +
            (Math.sin(t * 3) * factor) / 10,
        )
        dummy.scale.set(s, s, s)
        dummy.rotation.set(s * 5, s * 5, s * 5)

        dummy.updateMatrix()
        // And apply the matrix to the instanced item
        mesh.current.setMatrixAt(i, dummy.matrix)
        // Apply random color to the instanced item
        mesh.current.setColorAt(i, new THREE.Color(color))
      })
      mesh.current.instanceMatrix.needsUpdate = true
      mesh.current.instanceColor.needsUpdate = false
    })
    return (
      <>
        <group ref={ref}>
          <pointLight
            ref={light}
            distance={40}
            intensity={cursorLight ? 2 : 0}
            rotation={[-Math.PI / 2, 0, 0]}
            color="lightblue"
          />
          <instancedMesh
            position={[0, 52, 0]}
            ref={mesh}
            args={[undefined, undefined, count]}
          >
            <sphereGeometry args={[0.15, 10]} />
            <meshBasicMaterial ref={material} />
          </instancedMesh>
        </group>
      </>
    )
  },
)

export default Particles
