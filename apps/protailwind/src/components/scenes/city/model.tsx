import React from 'react'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import type {Object3D} from 'three/src/core/Object3D'

const GLTF_PATH = '/assets/city.gltf'

const CityModel: React.FC<any> = (props) => {
  const group = React.useRef<any>(null)
  const [nodes, setNodes]: any = React.useState<Object3D | null>(null)

  React.useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(GLTF_PATH, async (gltf) => {
      const nodes = await gltf.parser.getDependencies('node')
      setNodes(nodes)
    })
  }, [])

  const color = props.color || '#1F2738'

  return !nodes ? null : (
    <group ref={group} {...props} dispose={() => null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes[3].children[0].geometry} receiveShadow castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={nodes[3].children[1].geometry} receiveShadow castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={nodes[3].children[2].geometry} receiveShadow castShadow>
          <meshStandardMaterial color={'#384461'} />
        </mesh>
      </group>
      <group position={[4.51, 0, -16.68]} rotation={[-Math.PI / 2, 0, 0.03]}>
        <mesh geometry={nodes[8].geometry} receiveShadow castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}

export default CityModel
