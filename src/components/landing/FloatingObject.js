'use client'

import { useGLTF, Center } from '@react-three/drei'

export default function FloatingObject() {
  const { scene } = useGLTF('/model/goskate.glb')

  return (
    <Center>
      <primitive  rotation={[0, 0.3, 0]} object={scene} />
    </Center>
  )
}

useGLTF.preload('/model/goskate.glb')
