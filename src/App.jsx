import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls } from '@react-three/drei'

import Trees from './Components/Trees';
import Box from './Components/Box';
import Floor from './Components/Floor';

export default function App() {
  const [count, setCount] = useState(0)

  const cameraControlsRef = useRef()

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>


        <Canvas gl={{ antialias: false }} camera={{ position: [0, 10, 10], near: 5, far: 20 }}>
          <color attach="background" args={['#f0f0f0']} />
          {/* <Trees /> */}
          <Floor />
          <EffectComposer disableNormalPass>
            <N8AO aoRadius={0.5} intensity={1} />
            <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
          </EffectComposer>
          <CameraControls
            ref={cameraControlsRef}
            enabled={true}
            // minDistance={minDistance}
            // verticalDragToForward={verticalDragToForward}
            // dollyToCursor={dollyToCursor}
            // infinityDolly={infinityDolly}
          />
        </Canvas>

        {/* <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

          <Trees />
        </Canvas> */}
      </div>
    </>
  )
}


