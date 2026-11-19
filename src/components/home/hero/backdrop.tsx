"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, easeInOut, easeOutExpo, live } from "./shared";

const BACKDROP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Backdrop: slow ink smoke in warm and cool tones plus a vermilion eclipse dissolving into manga halftone.
// Colors are written directly in sRGB (no tone mapping) to match the page's --color-ink exactly.
const BACKDROP_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uScroll;
  uniform float uIntro;
  uniform float uWrap;
  uniform float uBead;
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

    // slowly drifting ink smoke
    vec2 q = p * 1.5 + uPointer * 0.04;
    vec2 warp = vec2(fbm(q + vec2(0.0, t * 0.035)), fbm(q + vec2(5.2, -t * 0.03)));
    float n1 = fbm(q * 1.2 + warp * 1.7 + vec2(t * 0.012, 0.0));
    float n2 = fbm(q * 1.0 - warp * 1.4 + vec2(3.7, t * 0.01));
    vec3 col = ink;
    col = mix(col, night, smoothstep(0.38, 0.8, n1) * smoothstep(-0.55, 0.45, p.y - p.x * 0.25) * 0.85);
    col = mix(col, ember, smoothstep(0.4, 0.85, n2) * smoothstep(0.35, -0.55, p.y + p.x * 0.12) * 0.8);

    // eclipse: on scroll the disc grows until it swallows the frame
    vec2 c = vec2(0.0, 0.065) - uPointer * 0.014;
    float R = 0.335 * min(1.0, uAspect * 1.25) * (1.0 + 4.8 * uScroll * uScroll) * mix(0.72, 1.0, uIntro);
    vec2 d = p - c;
    float r = length(d);
    float ang = atan(d.y, d.x);
    float o = max(r - R, 0.0) / R;
    float outside = smoothstep(R - 0.003, R + 0.003, r);
    float flare = fbm(vec2(ang * 2.4 + 1.3, r * 2.5 - t * 0.07));
    vec2 beadDir = normalize(vec2(-0.55, 0.83));
    float side = 0.5 + 0.5 * dot(d / max(r, 1e-4), beadDir);
    // the corona wraps around the disc, starting from the diamond-ring point
    float wrap = smoothstep(-0.3, 0.05, uWrap * 1.35 - (1.0 - side));
    float power = uIntro * wrap * (1.0 - uScroll * 0.3) * mix(0.42, 1.25, side * side);
    float glow = (exp(-o * 3.1) * (0.28 + 1.15 * flare) + exp(-o * 9.0) * 0.8) * power * outside;

    // halftone: dots shrink with distance from the corona
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

    // dark disc + thin bright rim
    float inside = 1.0 - outside;
    col = mix(col, ink, inside);
    col += shu * 0.11 * inside * smoothstep(R * 0.55, R, r) * power;
    col += mix(shu, foil, 0.75) * exp(-abs(r - R) * 520.0) * power * 1.1;

    // diamond ring: a bead flares on the rim at reveal, then keeps glimmering
    vec2 bp = p - (c + beadDir * R);
    float bd = length(bp);
    float core = 0.0007 / (bd * bd + 0.00009);
    float rayA = 0.0035 / (abs(bp.x * beadDir.y - bp.y * beadDir.x) + 0.0035) * exp(-bd * 7.0);
    float rayB = 0.0025 / (abs(dot(bp, beadDir)) + 0.0025) * exp(-bd * 13.0);
    col += vec3(1.0, 0.92, 0.78) * (core + rayA * 0.55 + rayB * 0.4) * uBead * mix(0.3, 1.0, outside);

    // vignette + dithering against banding
    col *= 1.0 - 0.5 * smoothstep(0.42, 1.05, length(p * vec2(0.78, 1.0)));
    col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 160.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Backdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScroll: { value: 0 },
      uIntro: { value: 0 },
      uWrap: { value: 0 },
      uBead: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    []
  );
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const since = live.introAt < 0 ? 0 : t - live.introAt;
    // read uniforms from the material itself: R3F may not keep the object passed as a prop
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = t;
    u.uAspect.value = state.size.width / state.size.height;
    u.uScroll.value = easeInOut(live.scroll);
    u.uIntro.value = easeOutExpo(clamp01(since / 3.2));
    u.uWrap.value = easeInOut(clamp01((since - 0.7) / 2.4));
    // flare quickly, then decay to a small twinkling bead
    const rise = easeInOut(clamp01((since - 0.45) / 0.3));
    const decay = Math.exp(-Math.max(0, since - 0.75) * 1.25);
    const rest = 0.13 * (0.82 + 0.18 * Math.sin(t * 2.1));
    u.uBead.value = rise * Math.max(decay, rest) * (1 - clamp01(live.scroll * 2.5));
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
