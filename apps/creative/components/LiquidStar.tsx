"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from "three";

// DVD-style bouncing sphere (no mouse tracking)
function LiquidSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);
    const { viewport } = useThree();

    // Position and velocity for bouncing
    const pos = useRef({ x: 0, y: 0 });
    // Random initial velocity
    const vel = useRef({
        x: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        y: (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1)
    });
    const sphereRadius = 0.8;

    useFrame((state) => {
        if (!meshRef.current) return;

        // Calculate boundaries (all 4 walls)
        const boundX = (viewport.width / 2) - sphereRadius - 0.2;
        const boundY = (viewport.height / 2) - sphereRadius - 0.2;

        // Update position
        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;

        // Bounce off RIGHT wall
        if (pos.current.x >= boundX) {
            pos.current.x = boundX;
            vel.current.x = -Math.abs(vel.current.x);
        }
        // Bounce off LEFT wall
        if (pos.current.x <= -boundX) {
            pos.current.x = -boundX;
            vel.current.x = Math.abs(vel.current.x);
        }
        // Bounce off TOP wall
        if (pos.current.y >= boundY) {
            pos.current.y = boundY;
            vel.current.y = -Math.abs(vel.current.y);
        }
        // Bounce off BOTTOM wall
        if (pos.current.y <= -boundY) {
            pos.current.y = -boundY;
            vel.current.y = Math.abs(vel.current.y);
        }

        // Apply position
        meshRef.current.position.x = pos.current.x;
        meshRef.current.position.y = pos.current.y;

        // Smooth rotation
        meshRef.current.rotation.x += 0.003;
        meshRef.current.rotation.y += 0.004;

        // Subtle distortion animation
        if (materialRef.current) {
            materialRef.current.distort = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
        }
    });

    return (
        <Sphere ref={meshRef} args={[sphereRadius, 128, 128]} position={[0, 0, 0]}>
            <MeshDistortMaterial
                ref={materialRef}
                color="#d4a84b"
                metalness={1}
                roughness={0.05}
                distort={0.25}
                speed={1.8}
                envMapIntensity={2.5}
            />
        </Sphere>
    );
}

// Scene
function Scene() {
    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[0, 0, 4]} intensity={1} color="#d4af37" />

            <LiquidSphere />
        </>
    );
}

export default function LiquidStar() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 50%)",
                }}
            />
        );
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
