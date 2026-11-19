import * as THREE from "three";
import { rng } from "./shared";

/**
 * Canvas-drawn textures that make the 3D books read as real ones:
 * a vertical title on the spine, a barcode on the back, individual sheets on the page edges.
 */

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};

const toTexture = (c: HTMLCanvasElement, aniso: number) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

/** Mutes the cover's accent color for use on the spine and back cover. */
function shade(hex: string, amount: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(hsl.s, 0.62), THREE.MathUtils.clamp(hsl.l + amount, 0.12, 0.9));
  return `#${c.getHexString()}`;
}

const cssFont = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

/** Page-edge grain. `along` is the axis the sheets stack along on the texture. */
export function pageEdgeTexture(along: "u" | "v", aniso: number) {
  const N = 128;
  const [c, ctx] = along === "u" ? canvas(N, 8) : canvas(8, N);
  const rand = rng(along === "u" ? 11 : 23);
  for (let i = 0; i < N; i++) {
    // each sheet varies slightly in brightness; the edges next to the covers are darker (cover shadow)
    const edge = Math.min(i, N - 1 - i) / N;
    const ao = Math.min(1, 0.72 + edge * 5);
    const v = (0.86 + rand() * 0.14) * ao;
    ctx.fillStyle = `rgb(${Math.round(244 * v)}, ${Math.round(235 * v)}, ${Math.round(214 * v)})`;
    if (along === "u") ctx.fillRect(i, 0, 1, 8);
    else ctx.fillRect(0, i, 8, 1);
  }
  const t = toTexture(c, aniso);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Spine: vertical title, publisher label at the foot. */
export function spineTexture(name: string, publisher: string, color: string, aniso: number) {
  const W = 112;
  const H = 1000;
  const [c, ctx] = canvas(W, H);
  const light = luminance(color) > 0.62;
  const bg = light ? "#f4efe4" : shade(color, -0.06);
  const fg = light ? shade(color, -0.25) : "#f6f1e6";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // color band at the head of the spine
  ctx.fillStyle = light ? shade(color, -0.1) : shade(color, 0.16);
  ctx.fillRect(0, 0, W, 46);

  // title rotated to read top to bottom
  const display = cssFont("--font-phudu", "sans-serif");
  const text = name.toUpperCase();
  const room = H - 46 - 190;
  let size = 50;
  ctx.font = `800 ${size}px ${display}`;
  let shown = text;
  while (ctx.measureText(shown).width > room && size > 30) {
    size -= 2;
    ctx.font = `800 ${size}px ${display}`;
  }
  while (ctx.measureText(shown).width > room && shown.length > 4) shown = shown.slice(0, -2).trimEnd() + "…";

  ctx.save();
  ctx.translate(W / 2, 46 + 34);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.fillText(shown, 0, 4);
  ctx.restore();

  // publisher label at the foot
  ctx.fillStyle = fg;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(18, H - 132, W - 36, 3);
  ctx.globalAlpha = 1;
  const mono = cssFont("--font-jbmono", "monospace");
  ctx.font = `500 19px ${mono}`;
  ctx.textAlign = "center";
  const words = publisher.toUpperCase().split(/\s+/).slice(0, 3);
  words.forEach((w, i) => ctx.fillText(w.slice(0, 7), W / 2, H - 96 + i * 24));

  // soft shading on both edges to suggest a rounded spine
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(0,0,0,0.28)");
  g.addColorStop(0.18, "rgba(0,0,0,0)");
  g.addColorStop(0.82, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  return toTexture(c, aniso);
}

/** Back cover: solid color, the faded cover as a pattern, a blurb block and a barcode. */
export function backTexture(image: CanvasImageSource | null, color: string, seed: number, aniso: number) {
  const W = 320;
  const H = 454;
  const [c, ctx] = canvas(W, H);
  // many real back covers are white: alternate so the ring is not one flat color
  const light = luminance(color) > 0.62 || seed % 2 === 0;
  const bg = light ? "#efe9dc" : shade(color, -0.1);
  const fg = light ? "rgba(30,26,22,0.5)" : "rgba(255,250,240,0.6)";
  const rand = rng(seed + 3);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (image) {
    ctx.save();
    ctx.globalAlpha = light ? 0.16 : 0.3;
    ctx.filter = "blur(14px) saturate(0.8)";
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, -20, -20, W + 40, H + 40);
    ctx.restore();
  }

  // blurb block
  ctx.fillStyle = fg;
  for (let i = 0; i < 9; i++) {
    const last = i === 8;
    ctx.fillRect(34, 70 + i * 15, last ? 90 + rand() * 80 : W - 68 - rand() * 26, 4);
  }

  // barcode
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(W - 138, H - 102, 104, 68);
  ctx.fillStyle = "#111111";
  let x = W - 130;
  while (x < W - 44) {
    const w = 1 + Math.floor(rand() * 3);
    ctx.fillRect(x, H - 96, w, 46);
    x += w + 1 + Math.floor(rand() * 3);
  }
  ctx.fillRect(W - 130, H - 46, 60, 3);

  // price
  ctx.fillStyle = fg;
  ctx.fillRect(34, H - 52, 54, 4);
  ctx.fillRect(34, H - 42, 34, 4);

  // crease next to the spine (seen from behind, the spine is on the right)
  const g = ctx.createLinearGradient(W - 16, 0, W, 0);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.55, "rgba(255,255,255,0.1)");
  g.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = g;
  ctx.fillRect(W - 16, 0, 16, H);

  return toTexture(c, aniso);
}

/** Redraws the front cover with a crease next to the spine, giving it a hinge like a real book. */
export function frontTexture(image: CanvasImageSource, aniso: number) {
  const W = 400;
  const H = 568;
  const [c, ctx] = canvas(W, H);
  ctx.drawImage(image, 0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 22, 0);
  g.addColorStop(0, "rgba(0,0,0,0.32)");
  g.addColorStop(0.45, "rgba(255,255,255,0.14)");
  g.addColorStop(0.7, "rgba(0,0,0,0.1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 22, H);
  return toTexture(c, aniso);
}
