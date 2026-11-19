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
const FONT_DISPLAY = "/fonts/DTPhudu-Black.otf";
const FONT_SERIF = "/fonts/Fraunces-Hero-Italic.ttf";

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

type Row = {
  text: string;
  kind: "serif" | "giant" | "shu";
  /** cỡ chữ so với dòng lớn nhất */
  size: number;
  /** chiều cao dòng chiếm chỗ, so với cỡ chữ */
  lead: number;
  align: "left" | "center" | "right";
};
const ROWS_WIDE: Row[] = [
  { text: "Bảng xếp hạng", kind: "serif", size: 0.4, lead: 1.3, align: "left" },
  { text: "LIGHT NOVEL", kind: "giant", size: 1, lead: 1.02, align: "center" },
  { text: "VIỆT NAM", kind: "shu", size: 0.66, lead: 1.22, align: "right" },
];
const ROWS_TALL: Row[] = [
  { text: "Bảng xếp hạng", kind: "serif", size: 0.4, lead: 1.3, align: "left" },
  { text: "LIGHT", kind: "giant", size: 1, lead: 0.9, align: "center" },
  { text: "NOVEL", kind: "giant", size: 1, lead: 0.96, align: "center" },
  { text: "VIỆT NAM", kind: "shu", size: 0.62, lead: 1.2, align: "right" },
];
const ECHOES = 3;

type TroikaText = THREE.Mesh & {
  fillOpacity: number;
  strokeOpacity: number;
  clipRect: number[] | null;
  textRenderInfo?: { blockBounds: number[] };
};

/**
 * Tiêu đề dựng theo thứ bậc: dòng serif nghiêng nhỏ → "LIGHT NOVEL" khổng lồ → "VIỆT NAM" đỏ son.
 * Dòng khổng lồ kéo theo các "bóng viền" lùi dần vào chiều sâu, lệch nhau khi rê chuột.
 */
function Title({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rowRefs = useRef<(THREE.Group | null)[]>([]);
  const mains = useRef<(TroikaText | null)[]>([]);
  const echoes = useRef<(TroikaText | null)[][]>([]);
  const viewport = useThree((s) => s.viewport);

  const rows = compact ? ROWS_TALL : ROWS_WIDE;
  const clips = useMemo(() => rows.map(() => [-100, 0, 100, 0]), [rows]);
  const total = rows.reduce((sum, r) => sum + r.size * r.lead, 0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const since = live.introAt < 0 ? 0 : t - live.introAt;
    const p = live.scroll;
    const fade = 1 - clamp01(p * 1.6);

    // bề ngang khối chữ = dòng khổng lồ rộng nhất (đo từ glyph thật sau khi troika dựng xong)
    let block = 0;
    for (let i = 0; i < rows.length; i++) {
      const bb = rows[i].kind === "giant" ? mains.current[i]?.textRenderInfo?.blockBounds : undefined;
      if (bb) block = Math.max(block, bb[2] - bb[0]);
    }
    if (!block) block = compact ? 4.2 : 8.6;
    const fit = Math.min(
      (viewport.width * (compact ? 0.9 : 0.84)) / block,
      (viewport.height * (compact ? 0.42 : 0.56)) / total,
      compact ? 9 : 1.5
    );

    let y = total / 2;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const h = r.size * r.lead;
      const e = easeOutExpo(clamp01((since - 0.1 - i * 0.14) / 1.7));
      const row = rowRefs.current[i];
      if (row) {
        row.position.x = r.align === "left" ? -block / 2 : r.align === "right" ? block / 2 : 0;
        row.position.y = y - h / 2 - (1 - e) * r.size * 0.55;
      }
      y -= h;

      const main = mains.current[i];
      if (main) {
        main.fillOpacity = e * fade;
        // màn che kéo từ dưới lên
        const c = clips[i];
        c[1] = -r.size * 1.1;
        c[3] = -r.size * 1.1 + e * r.size * 2.4;
        main.clipRect = c;
      }
      const list = echoes.current[i];
      if (list) {
        const eo = easeOutExpo(clamp01((since - 0.9 - i * 0.14) / 2.2));
        for (let k = 0; k < list.length; k++) {
          const m = list[k];
          if (!m) continue;
          m.position.z = -(k + 1) * (0.34 * eo + p * 1.3);
          m.strokeOpacity = (eo * fade * 0.55) / (k + 1);
        }
      }
    }
    if (group.current) {
      group.current.position.z = -p * 3;
      group.current.position.y = TITLE_Y * (compact ? 1.8 : 0.75);
      group.current.scale.setScalar(fit);
    }
  });

  return (
    <group ref={group}>
      {rows.map((r, i) => (
        <group
          key={r.text}
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
        >
          <Text
            ref={(el: TroikaText | null) => {
              mains.current[i] = el;
            }}
            font={r.kind === "serif" ? FONT_SERIF : FONT_DISPLAY}
            fontSize={r.size}
            letterSpacing={r.kind === "serif" ? -0.03 : -0.012}
            anchorX={r.align}
            anchorY="middle"
            color={r.kind === "shu" ? SHU : PAPER}
            fillOpacity={0}
            renderOrder={2}
          >
            {r.text}
            <meshBasicMaterial transparent fog={false} toneMapped={false} />
          </Text>
          {r.kind === "giant" &&
            Array.from({ length: ECHOES }, (_, k) => (
              <Text
                key={k}
                ref={(el: TroikaText | null) => {
                  (echoes.current[i] ??= [])[k] = el;
                }}
                font={FONT_DISPLAY}
                fontSize={r.size}
                letterSpacing={-0.012}
                anchorX={r.align}
                anchorY="middle"
                fillOpacity={0}
                strokeWidth={0.011}
                strokeColor={k === 0 ? PAPER : SHU}
                strokeOpacity={0}
                renderOrder={1}
              >
                {r.text}
                <meshBasicMaterial transparent fog={false} toneMapped={false} depthWrite={false} />
              </Text>
            ))}
        </group>
      ))}
    </group>
  );
}

const BACKDROP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Nền: khói mực hai tông nóng/lạnh + một vầng "nhật thực" đỏ son tan dần thành hạt tram manga.
// Màu viết thẳng ở sRGB (không qua tone mapping) để khớp tuyệt đối với --color-ink của trang.
const BACKDROP_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uScroll;
  uniform float uIntro;
  uniform vec2 uPointer;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 5; i++) {
      s += a * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      a *= 0.5;
    }
    return s;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime;
    vec3 ink = vec3(0.047, 0.043, 0.039);
    vec3 shu = vec3(0.941, 0.259, 0.110);
    vec3 foil = vec3(1.0, 0.78, 0.50);
    vec3 ember = vec3(0.36, 0.075, 0.03);
    vec3 night = vec3(0.05, 0.075, 0.15);

    // khói mực trôi chậm
    vec2 q = p * 1.5 + uPointer * 0.04;
    vec2 warp = vec2(fbm(q + vec2(0.0, t * 0.035)), fbm(q + vec2(5.2, -t * 0.03)));
    float n1 = fbm(q * 1.2 + warp * 1.7 + vec2(t * 0.012, 0.0));
    float n2 = fbm(q * 1.0 - warp * 1.4 + vec2(3.7, t * 0.01));
    vec3 col = ink;
    col = mix(col, night, smoothstep(0.38, 0.8, n1) * smoothstep(-0.55, 0.45, p.y - p.x * 0.25) * 0.85);
    col = mix(col, ember, smoothstep(0.4, 0.85, n2) * smoothstep(0.35, -0.55, p.y + p.x * 0.12) * 0.8);

    // nhật thực
    vec2 c = vec2(0.0, 0.065) - uPointer * 0.014;
    float R = 0.335 * min(1.0, uAspect * 1.25) * (1.0 + uScroll * 0.3) * mix(0.72, 1.0, uIntro);
    vec2 d = p - c;
    float r = length(d);
    float ang = atan(d.y, d.x);
    float o = max(r - R, 0.0) / R;
    float outside = smoothstep(R - 0.003, R + 0.003, r);
    float flare = fbm(vec2(ang * 2.4 + 1.3, r * 2.5 - t * 0.07));
    float side = 0.5 + 0.5 * dot(d / max(r, 1e-4), normalize(vec2(-0.55, 0.83)));
    float power = uIntro * (1.0 - uScroll * 0.45) * mix(0.42, 1.25, side * side);
    float glow = (exp(-o * 3.1) * (0.28 + 1.15 * flare) + exp(-o * 9.0) * 0.8) * power * outside;

    // hạt tram: càng xa vầng sáng hạt càng nhỏ
    mat2 rot = mat2(0.7071, -0.7071, 0.7071, 0.7071);
    vec2 g = rot * p * 118.0;
    float cell = length(fract(g) - 0.5);
    float tone = clamp(glow * 0.85, 0.0, 1.0);
    float rad = sqrt(tone) * 0.66;
    float aa = fwidth(cell) * 1.2;
    float dots = (1.0 - smoothstep(rad - aa, rad + aa, cell)) * step(0.012, tone);
    float soft = smoothstep(0.42, 0.0, o);
    float lit = mix(dots * (0.4 + 0.6 * tone), tone, soft * 0.85);
    vec3 hot = mix(shu, foil, smoothstep(0.7, 1.6, glow) * soft);
    col += hot * lit * 0.95;
    col += shu * glow * 0.1;

    // lòng đĩa tối + viền sáng mảnh
    float inside = 1.0 - outside;
    col = mix(col, ink * 0.5, inside * uIntro);
    col += shu * 0.11 * inside * smoothstep(R * 0.55, R, r) * power;
    col += mix(shu, foil, 0.75) * exp(-abs(r - R) * 520.0) * power * 1.1;

    // tối góc + khử sọc màu
    col *= 1.0 - 0.5 * smoothstep(0.42, 1.05, length(p * vec2(0.78, 1.0)));
    col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 160.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Backdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScroll: { value: 0 },
      uIntro: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    []
  );
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const since = live.introAt < 0 ? 0 : t - live.introAt;
    // đọc uniforms từ chính material: R3F có thể không giữ nguyên object truyền qua prop
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = t;
    u.uAspect.value = state.size.width / state.size.height;
    u.uScroll.value = easeInOut(live.scroll);
    u.uIntro.value = easeOutExpo(clamp01(since / 3.2));
    u.uPointer.value.lerp(state.pointer, 1 - Math.pow(0.02, dt));
  });
  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={BACKDROP_VERT}
        fragmentShader={BACKDROP_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
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
