"use client";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Backdrop from "./backdrop";
import Books from "./books";
import Title from "./title";
import { INK, PAPER, SHU, rng, useScrollAndDrag } from "./shared";
import type { HeroBook } from "./shared";

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = rng(77);
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (rand() - 0.5) * 26;
      arr[i + 1] = (rand() - 0.5) * 12;
      arr[i + 2] = (rand() - 0.5) * 18;
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={PAPER} size={0.028} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const k = 1 - Math.pow(0.02, dt);
    ref.current.rotation.y += (state.pointer.x * 0.16 - ref.current.rotation.y) * k;
    ref.current.rotation.x += (-state.pointer.y * 0.09 - ref.current.rotation.x) * k;
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ books, active }: { books: HeroBook[]; active: boolean }) {
  useScrollAndDrag();
  const compact = typeof window !== "undefined" && window.innerWidth < window.innerHeight;
  const list = useMemo(() => (compact ? books.slice(0, 20) : books), [books, compact]);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 11], fov: compact ? 52 : 35, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[INK]} />
      {/* dense fog: distant books become silhouettes against the corona */}
      <fog attach="fog" args={[INK, 8.5, 16.5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 8]} intensity={1.7} />
      {/* back lights from the eclipse side: vermilion rim on the book edges */}
      <directionalLight position={[-5, 7, -9]} intensity={4} color="#ff7a3c" />
      <directionalLight position={[6, -2, -8]} intensity={1.6} color={SHU} />
      {/* virtual studio built in place (no HDR download): light panels for the glossy covers to reflect */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.3} color="#fff4e2" position={[-5, 6, 7]} scale={[10, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[7, 2, 6]} scale={[2, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.5} color="#dfe6ff" position={[0, -5, 8]} scale={[14, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1} color="#f0421c" position={[0, 1, -9]} scale={5} target={[0, 0, 0]} />
      </Environment>
      <pointLight position={[0, 0.5, -1.5]} intensity={35} distance={12} color={SHU} />
      <Backdrop />
      <Rig>
        <Suspense fallback={null}>
          <Title compact={compact} />
        </Suspense>
        <Suspense fallback={null}>
          <Books books={list} compact={compact} />
        </Suspense>
        <Dust />
      </Rig>
    </Canvas>
  );
}
