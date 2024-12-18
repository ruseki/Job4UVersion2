// src/Landing_Page/3DModel.js
import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader, MeshStandardMaterial, PlaneGeometry, ShadowMaterial } from 'three';
import { OrbitControls } from '@react-three/drei'; 
import * as THREE from 'three';

const initializeModel = (modelRef, position = [0, -3, 0], scale = [7, 7, 7]) => {
  if (modelRef.current) {
    modelRef.current.position.set(...position);
    modelRef.current.scale.set(...scale);
  }
};

function Model({ modelPath, texturePath, position = [-1, -3, 0], scale = [10, 10, 10] }) { // IF WANT NYO IADJUST, ETO GALAWIN NYO, XYZ PAGKAKASUNOD SA POSITION
  const gltf = useLoader(GLTFLoader, modelPath);
  const texture = useLoader(TextureLoader, texturePath);
  const modelRef = useRef();
  const tiltRef = useRef(0);
  const swingRef = useRef(0);
  const isInteracting = useRef(false); 

  useEffect(() => {
    if (gltf && modelRef.current) {
      initializeModel(modelRef, position, scale);

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new MeshStandardMaterial({ map: texture });
          child.castShadow = true;
        }
      });
    }
  }, [gltf, texture, position, scale]);

  useFrame(() => {
    if (modelRef.current && !isInteracting.current) {
      tiltRef.current += 0.01; 
      swingRef.current += 0.005; 
      modelRef.current.rotation.y = Math.sin(tiltRef.current) * 0.2; 
      modelRef.current.rotation.x = Math.sin(swingRef.current) * 0.1; 
    }
  });

  
  const handleMouseUp = () => {
    isInteracting.current = false;
  };

  const handleMouseDown = () => {
    isInteracting.current = true;
  };

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.5}
        onStart={handleMouseDown} 
        onEnd={handleMouseUp} 
      />
    </group>
  );
}


function ShadowPlane({ position = [0, -3.1, 0], size = [100, 100], opacity = 0.5 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry attach="geometry" args={size} />
      <shadowMaterial attach="material" opacity={opacity} />
    </mesh>
  );
}

function ThreeScene() {
  return (
    <div className="3dmodel_container" style={{ width: '700px', height: '800px', margin: 'auto', marginLeft: 'auto' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 100 }}>
        {}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[0, 3, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {}
        <Model modelPath="/hero/JOBv2_3Dv2.glb" texturePath="/hero/altbg3.png" />
        <ShadowPlane />
      </Canvas>
    </div>
  );
}

export default ThreeScene;
