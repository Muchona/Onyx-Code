import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function OnyxCore() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.2;
        meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* Inner Black Core */}
                <mesh>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshPhysicalMaterial
                        color="#080808"
                        roughness={0.2}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* Outer Gold Wireframe */}
                <mesh scale={[1.05, 1.05, 1.05]}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshStandardMaterial
                        color="#D4AF37"
                        wireframe
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={1}
                    />
                </mesh>

                {/* Floating Particles/Satellites */}
                <mesh position={[2.5, 0, 0]} scale={0.1}>
                    <octahedronGeometry />
                    <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={2} />
                </mesh>
                <mesh position={[-2, 1.5, 1]} scale={0.08}>
                    <octahedronGeometry />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                </mesh>
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#blue" />
                <Environment preset="city" />
                <OnyxCore />
            </Canvas>
        </div>
    );
}
