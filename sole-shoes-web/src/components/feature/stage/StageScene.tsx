"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

function ShoeModel({ color }: { color: string }) {
  const { scene } = useGLTF("/shoe-file.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone material to avoid shared state issues if needed, or modify directly
        // This logic heavily depends on the model structure. 
        // For a general "color change", we often target specific parts or the main material.
        // Here we attempt to tint the whole shoe or specific known parts if named.
        // For generic GLBs, better to just set color on standard materials.
        if (mesh.material) {
            // Create a clone if not already unique to this instance to prevent cached material issues
            if (!Array.isArray(mesh.material)) {
                 // Simple tinting for demo purposes
                 (mesh.material as THREE.MeshStandardMaterial).color.set(color);
            }
        }
      }
    });
  }, [scene, color]);

  return (
    <Center>
      <primitive object={scene} scale={0.8} /> 
    </Center>
  );
}

const colors = ["#ffffff", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#000000"];

export function StageScene() {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  return (
    <div className="w-full h-[50vh] lg:h-[85vh] relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        {/* Overlay UI */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-4 items-end">
            <div className="bg-white/65 backdrop-blur-md border border-white/40 dark:bg-black/65 dark:border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="animate-spin-slow">↻</span>
                Interactive 3D
            </div>
            
            {/* Color Picker */}
            <div className="bg-white/65 backdrop-blur-md border border-white/40 dark:bg-black/65 dark:border-white/10 p-3 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customize</span>
                <div className="flex flex-col gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? "border-primary scale-110" : "border-transparent hover:scale-110"}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            </div>
        </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={selectedColor} />
        
        <ShoeModel color={selectedColor} />
        
        <ContactShadows
          resolution={1024}
          scale={10}
          blur={2.5}
          opacity={0.5}
          far={10}
          color="#000000"
        />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
