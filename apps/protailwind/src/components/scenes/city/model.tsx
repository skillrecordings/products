import React from 'react'
import {useGLTF} from '@react-three/drei'

const GLTF_PATH = '/assets/city.gltf'

const CityModel: React.FC<any> = (props) => {
  const group = React.useRef<any>(null)
  const {nodes}: any = useGLTF(GLTF_PATH)
  const color = props.color || '#1F2738'

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes['Fild_02_-_Default_Slot_#1_0'].geometry}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          geometry={nodes['Fild_02_-_Default_0'].geometry}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          geometry={nodes['Fild_Material_#11_0'].geometry}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={'#384461'} />
        </mesh>
      </group>
      <group position={[4.51, 0, -16.68]} rotation={[-Math.PI / 2, 0, 0.03]}>
        <mesh
          geometry={nodes['Line006_02_-_Default_Slot_#1_0'].geometry}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload(GLTF_PATH)

export default CityModel
