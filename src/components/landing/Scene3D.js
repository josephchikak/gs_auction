'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, Bounds, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import FloatingObject from './FloatingObject'

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className='absolute inset-0'
    >
      <color attach='background' args={['#FDF1D8']} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Bounds fit clip margin={1.2} damping={Infinity}>
          <FloatingObject />
        </Bounds>
        <Environment preset='city' />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  )
}
