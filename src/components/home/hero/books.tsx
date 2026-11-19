"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { intro } from "@/lib/intro";
import { backTexture, frontTexture, pageEdgeTexture, spineTexture } from "./book-textures";
import { PAPER, SHU, clamp01, easeInOut, easeOutExpo, live, rng } from "./shared";
import type { HeroBook } from "./shared";

const BOOK_W = 0.92;
const BOOK_H = 1.3;
const BOOK_D = 0.125; // page block thickness
const CARD = 0.007; // cover board thickness
const INSET = 0.012; // how far the covers overhang the page block
const RING_TILT = 0.34;
const RING_Y = -1.0;
const R_INNER = 3.75;
const R_OUTER = 5.7;

const EULER = new THREE.Euler();
const FACING = new THREE.Quaternion();

export default function Books({ books, compact }: { books: HeroBook[]; compact: boolean }) {
  const textures = useTexture(books.map((b) => b.cover));
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  // A book is four boxes: front cover, back cover, spine and page block (slightly inset from the covers).
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
      // white paper core showing at the cover edges
      card: new THREE.MeshStandardMaterial({ color: "#f3efe6", roughness: 0.9 }),
      // BoxGeometry face order: +x, -x, +y, -y, +z, -z
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
      // laminated cover: the clearcoat catches the environment lights
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
        // BoxGeometry face order: +x, -x, +y, -y, +z, -z
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
      // On scroll every book gradually turns its cover toward the viewer.
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
