"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { PAPER, SHU, clamp01, easeOutExpo, live } from "./shared";

const FONT_DISPLAY = "/fonts/DTPhudu-Black.otf";
const FONT_SERIF = "/fonts/Fraunces-Hero-Italic.ttf";
const TITLE_Y = 0.55;

type Row = {
  text: string;
  kind: "serif" | "giant" | "shu";
  /** font size relative to the largest row */
  size: number;
  /** line height the row occupies, relative to its font size */
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
  outlineOpacity: number;
  clipRect: number[] | null;
  textRenderInfo?: { blockBounds: number[] };
};

/**
 * Material for "VIỆT NAM": heated metal, gold at the top of the letters fading to vermilion,
 * with a diagonal highlight. Shifting the texture horizontally sweeps the highlight across the row.
 */
function emberTexture() {
  const W = 1024;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const heat = ctx.createLinearGradient(0, 0, 0, H);
  heat.addColorStop(0, "#ffe2ad");
  heat.addColorStop(0.22, "#ffab52");
  heat.addColorStop(0.55, "#f6501f");
  heat.addColorStop(1, "#d62c0a");
  ctx.fillStyle = heat;
  ctx.fillRect(0, 0, W, H);
  ctx.transform(1, 0, -0.5, 1, H * 0.25, 0);
  const streak = ctx.createLinearGradient(W * 0.45, 0, W * 0.55, 0);
  streak.addColorStop(0, "rgba(255,244,214,0)");
  streak.addColorStop(0.5, "rgba(255,244,214,0.95)");
  streak.addColorStop(1, "rgba(255,244,214,0)");
  ctx.fillStyle = streak;
  ctx.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.x = 0.5;
  return t;
}

/**
 * Title built as a hierarchy: a small italic serif row, a giant "LIGHT NOVEL", then "VIỆT NAM" in vermilion.
 * The large rows trail outlined echoes receding in depth, which shift apart as the pointer moves.
 */
export default function Title({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rowRefs = useRef<(THREE.Group | null)[]>([]);
  const mains = useRef<(TroikaText | null)[]>([]);
  const echoes = useRef<(TroikaText | null)[][]>([]);
  const viewport = useThree((s) => s.viewport);

  const rows = compact ? ROWS_TALL : ROWS_WIDE;
  const clips = useMemo(() => rows.map(() => [-100, 0, 100, 0]), [rows]);
  const ember = useMemo(() => emberTexture(), []);
  const total = rows.reduce((sum, r) => sum + r.size * r.lead, 0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const since = live.introAt < 0 ? 0 : t - live.introAt;
    const p = live.scroll;
    const fade = 1 - clamp01(p * 1.6);
    // the highlight sweeps "VIỆT NAM" every ~5.5s (it is off the text for most of the cycle)
    ember.offset.x = -((t * 0.18) % 1);

    // block width = the widest giant row, measured from real glyphs once troika has laid them out
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
        if (r.kind === "shu") main.outlineOpacity = e * fade * (0.5 + 0.12 * Math.sin(t * 1.3));
        // mask wiping up from the bottom
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
            color={r.kind === "shu" ? "#ffffff" : PAPER}
            fillOpacity={0}
            {...(r.kind === "shu"
              ? { outlineWidth: 0, outlineBlur: r.size * 0.22, outlineColor: SHU, outlineOpacity: 0 }
              : {})}
            renderOrder={2}
          >
            {r.text}
            <meshBasicMaterial transparent fog={false} toneMapped={false} map={r.kind === "shu" ? ember : null} />
          </Text>
          {r.kind !== "serif" &&
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
                strokeColor={k === 0 && r.kind === "giant" ? PAPER : SHU}
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
