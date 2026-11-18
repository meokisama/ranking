"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { intro } from "@/lib/intro";
import { backTexture, frontTexture, pageEdgeTexture, spineTexture } from "./bookTextures";

export type HeroBook = { cover: string; color: string; name: string; publisher: string };

const INK = "#0c0b0a";
const PAPER = "#efe9dd";
const SHU = "#f0421c";
const FONT = "/fonts/DTPhudu-Black.otf";

const BOOK_W = 0.92;
const BOOK_H = 1.3;
const BOOK_D = 0.125; // độ dày ruột sách
const CARD = 0.007; // độ dày bìa
const INSET = 0.012; // bìa nhô ra khỏi ruột giấy
const RING_TILT = 0.34;
const RING_Y = -1.0;
const TITLE_Y = 0.55;
const R_INNER = 3.75;
const R_OUTER = 5.7;

const EULER = new THREE.Euler();
const FACING = new THREE.Quaternion();

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t: number) => t * t * (3 - 2 * t);

/** Số ngẫu nhiên có hạt giống để bố cục giống nhau giữa các lần tải. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Trạng thái dùng chung giữa các thành phần trong cảnh (không gây render lại). */
const live = { scroll: 0, spin: 0, vel: 0, introAt: -1 };

function useScrollAndDrag() {
  useEffect(() => {
    const onScroll = () => {
      live.scroll = clamp01(window.scrollY / (window.innerHeight * 0.9));
    };
    let lastX: number | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.buttons !== 1) {
        lastX = null;
        return;
      }
      if (lastX !== null) live.vel += (e.clientX - lastX) * 0.00035;
      lastX = e.clientX;
    };
    const onUp = () => {
      lastX = null;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);
}

function Books({ books, compact }: { books: HeroBook[]; compact: boolean }) {
  const textures = useTexture(books.map((b) => b.cover));
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  // Một cuốn sách = 4 khối: bìa trước, bìa sau, gáy, ruột giấy (thụt vào một chút so với bìa).
  const geo = useMemo(
    () => ({
      cover: new THREE.BoxGeometry(BOOK_W, BOOK_H, CARD),
      spine: new THREE.BoxGeometry(CARD, BOOK_H, BOOK_D),
      block: new THREE.BoxGeometry(BOOK_W - CARD - INSET, BOOK_H - INSET * 2, BOOK_D),
    }),
    []
  );

  const shared = useMemo(() => {
    const aniso = Math.min(8, maxAniso);
    const paper = new THREE.MeshStandardMaterial({ color: "#efe6d0", roughness: 1 });
    const edgeU = new THREE.MeshStandardMaterial({ map: pageEdgeTexture("u", aniso), roughness: 1 });
    const edgeV = new THREE.MeshStandardMaterial({ map: pageEdgeTexture("v", aniso), roughness: 1 });
    return {
      aniso,
      // lõi giấy trắng lộ ra ở mép bìa
      card: new THREE.MeshStandardMaterial({ color: "#f3efe6", roughness: 0.9 }),
      // thứ tự mặt của BoxGeometry: +x, -x, +y, -y, +z, -z
      block: [edgeU, paper, edgeV, edgeV, paper, paper],
    };
  }, [maxAniso]);

  const items = useMemo(() => {
    const rand = rng(20241224);
    const inner = compact ? 9 : 13;
    return books.map((b, i) => {
      const isInner = i < inner;
      const n = isInner ? inner : books.length - inner;
      const k = isInner ? i : i - inner;
      const image = textures[i].image as CanvasImageSource;
      const { aniso, card } = shared;
      // bìa cán bóng: lớp clearcoat bắt ánh đèn môi trường
      const matte = { roughness: 0.5, envMapIntensity: 0.55 };
      const front = new THREE.MeshPhysicalMaterial({
        map: frontTexture(image, aniso),
        roughness: 0.42,
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        envMapIntensity: 0.4,
      });
      const back = new THREE.MeshStandardMaterial({ map: backTexture(image, b.color, i, aniso), ...matte });
      const spine = new THREE.MeshStandardMaterial({ map: spineTexture(b.name, b.publisher, b.color, aniso), ...matte });
      return {
        // thứ tự mặt của BoxGeometry: +x, -x, +y, -y, +z, -z
        front: [card, card, card, card, front, card],
        back: [card, card, card, card, card, back],
        spine: [card, spine, card, card, card, card],
        angle: (k / n) * Math.PI * 2 + (isInner ? 0 : 0.4) + (rand() - 0.5) * 0.12,
        radius: isInner ? R_INNER + (rand() - 0.5) * 0.25 : R_OUTER + (rand() - 0.5) * 0.9,
        y: isInner ? (rand() - 0.5) * 0.35 : (rand() - 0.5) * 2.6 + 0.5,
        speed: isInner ? 1 : 0.55,
        yaw: (rand() - 0.5) * 0.5,
        tiltX: (rand() - 0.5) * 0.3,
        tiltZ: (rand() - 0.5) * 0.3,
        phase: rand() * Math.PI * 2,
        delay: rand() * 0.9,
      };
    });
  }, [books, textures, compact, shared]);

  useEffect(() => {
    intro.setReady();
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (live.introAt < 0 && intro.revealed) live.introAt = t;
    const since = live.introAt < 0 ? 0 : t - live.introAt;

    live.vel *= Math.pow(0.04, dt);
    live.spin += dt * 0.085 + live.vel;
    const p = easeInOut(live.scroll);

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const m = refs.current[i];
      if (!m) continue;
      const e = easeOutExpo(clamp01((since - it.delay) / 2.4));
      const a = it.angle + live.spin * it.speed - (1 - e) * 1.6;
      const r = it.radius * (1 + p * 0.4) * (2.4 - 1.4 * e);
      m.position.set(
        Math.cos(a) * r,
        it.y * (1 + p * 0.6) + Math.sin(t * 0.6 + it.phase) * 0.1 + (1 - e) * 3,
        Math.sin(a) * r
      );
      EULER.set(
        it.tiltX + Math.sin(t * 0.4 + it.phase) * 0.07 + (1 - e) * 2,
        Math.PI / 2 - a + it.yaw,
        it.tiltZ + Math.cos(t * 0.35 + it.phase) * 0.05
      );
      // Khi cuộn: mọi cuốn sách xoay dần bìa về phía người xem.
      m.quaternion.setFromEuler(EULER).slerp(FACING, p * 0.9);
      m.scale.setScalar(0.001 + e);
    }
    if (group.current) {
      group.current.rotation.x = RING_TILT * (1 - p * 0.6);
      group.current.rotation.z = -0.1;
      group.current.position.y = RING_Y * (1 - p * 0.75);
    }
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          scale={0.001}
        >
          <mesh geometry={geo.cover} material={it.front} position-z={(BOOK_D + CARD) / 2} />
          <mesh geometry={geo.cover} material={it.back} position-z={-(BOOK_D + CARD) / 2} />
          <mesh geometry={geo.spine} material={it.spine} position-x={(CARD - BOOK_W) / 2} />
          <mesh geometry={geo.block} material={shared.block} position-x={(CARD - INSET) / 2} />
        </group>
      ))}
      {/* quỹ đạo */}
      {[R_INNER, R_OUTER].map((r) => (
        <mesh key={r} rotation-x={Math.PI / 2}>
          <torusGeometry args={[r, 0.0035, 6, 240]} />
          <meshBasicMaterial
            color={r === R_INNER ? SHU : PAPER}
            transparent
            opacity={r === R_INNER ? 0.55 : 0.14}
          />
        </mesh>
      ))}
    </group>
  );
}

type Line = { text: string; kind: "fill" | "stroke" | "shu" };
const LINES_WIDE: Line[] = [
  { text: "BẢNG XẾP HẠNG", kind: "fill" },
  { text: "LIGHT NOVEL", kind: "stroke" },
  { text: "VIỆT NAM", kind: "shu" },
];
const LINES_TALL: Line[] = [
  { text: "BẢNG", kind: "fill" },
  { text: "XẾP HẠNG", kind: "fill" },
  { text: "LIGHT", kind: "stroke" },
  { text: "NOVEL", kind: "stroke" },
  { text: "VIỆT NAM", kind: "shu" },
];

function Title({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const width = useThree((s) => s.viewport.width);

  const lines = compact ? LINES_TALL : LINES_WIDE;
  const size = 1.34;
  const lh = size * 1.02;
  const natural = compact ? 6.6 : 10.6;
  const fit = Math.min(1, (width * (compact ? 0.9 : 0.8)) / natural);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const since = live.introAt < 0 ? 0 : t - live.introAt;
    const p = live.scroll;
    for (let i = 0; i < lines.length; i++) {
      const e = easeOutExpo(clamp01((since - 0.15 - i * 0.12) / 1.6));
      const m = mats.current[i];
      const o = e * (1 - clamp01(p * 1.6));
      if (m) m.opacity = o;
      const mesh = group.current?.children[i] as (THREE.Object3D & { strokeOpacity?: number }) | undefined;
      if (mesh && lines[i].kind === "stroke") mesh.strokeOpacity = o;
      if (mesh) mesh.position.y = ((lines.length - 1) / 2 - i) * lh - (1 - e) * 0.6;
    }
    if (group.current) {
      group.current.position.z = -p * 3;
      group.current.position.y = TITLE_Y * fit;
      group.current.scale.setScalar(fit);
    }
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <Text
          key={l.text}
          font={FONT}
          fontSize={size}
          letterSpacing={-0.005}
          anchorX="center"
          anchorY="middle"
          position-y={((lines.length - 1) / 2 - i) * lh}
          {...(l.kind === "stroke" ? { fillOpacity: 0, strokeWidth: 0.018, strokeColor: PAPER } : {})}
        >
          {l.text}
          <meshBasicMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            color={l.kind === "shu" ? SHU : PAPER}
            transparent
            opacity={0}
            fog={false}
            toneMapped={false}
          />
        </Text>
      ))}
    </group>
  );
}

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
      <fog attach="fog" args={[INK, 8.5, 19]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 8]} intensity={1.7} />
      {/* "Studio" ảo dựng tại chỗ (không tải HDR): các tấm đèn để bìa bóng có thứ mà phản chiếu */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.3} color="#fff4e2" position={[-5, 6, 7]} scale={[10, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[7, 2, 6]} scale={[2, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.5} color="#dfe6ff" position={[0, -5, 8]} scale={[14, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1} color="#f0421c" position={[0, 1, -9]} scale={5} target={[0, 0, 0]} />
      </Environment>
      <pointLight position={[0, 0.5, -1.5]} intensity={35} distance={12} color={SHU} />
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
