"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls, Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

function ShoeModel() {
  const { scene } = useGLTF("/nike-air.glb");
  return <primitive object={scene} scale={1.1} position={[0, -4, 0]} />;
}

export function HeroScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        
        <PresentationControls
          global
          snap={false}
          rotation={[0, -0.3, 0]} 
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Infinity, Infinity]}
        >
          <Suspense fallback={null}>
             {/* Manual lighting setup for cleaner control */}
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[0, 0.2]}>
                <ShoeModel />
             </Float>
             <Environment preset="city" blur={1} />
          </Suspense>
        </PresentationControls>
        
        {/* Soft, diffuse shadow */}
        <ContactShadows 
          position={[0, -4.8, 0]} 
          opacity={0.3} 
          scale={10} 
          blur={2.5} 
          far={3} 
          color="#000000"
          smooth={false}
          resolution={1024}
        />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/nike-air.glb");
