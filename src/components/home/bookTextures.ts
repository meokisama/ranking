import * as THREE from "three";

/**
 * Các texture vẽ bằng canvas để cuốn sách 3D trông như sách thật:
 * gáy có tựa in dọc, bìa sau có mã vạch, ruột giấy có vân từng tờ.
 */

const PAPER = "#f1e8d3";

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

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

/** Làm dịu màu nhấn của bìa để dùng cho gáy và bìa sau. */
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

/** Vân mép giấy. `along` = hướng các tờ giấy xếp chồng trên texture. */
export function pageEdgeTexture(along: "u" | "v", aniso: number) {
  const N = 128;
  const [c, ctx] = along === "u" ? canvas(N, 8) : canvas(8, N);
  const rand = rng(along === "u" ? 11 : 23);
  for (let i = 0; i < N; i++) {
    // mỗi "tờ" lệch sáng tối một chút, hai mép sát bìa tối hơn (bóng đổ của bìa)
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

/** Gáy sách: tựa in dọc, nhãn nhà phát hành ở chân gáy. */
export function spineTexture(name: string, publisher: string, color: string, aniso: number) {
  const W = 112;
  const H = 1000;
  const [c, ctx] = canvas(W, H);
  const light = luminance(color) > 0.62;
  const bg = light ? "#f4efe4" : shade(color, -0.06);
  const fg = light ? shade(color, -0.25) : "#f6f1e6";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // dải màu ở đầu gáy
  ctx.fillStyle = light ? shade(color, -0.1) : shade(color, 0.16);
  ctx.fillRect(0, 0, W, 46);

  // tựa sách xoay dọc, đọc từ trên xuống
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

  // nhãn nhà phát hành ở chân gáy
  ctx.fillStyle = fg;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(18, H - 132, W - 36, 3);
  ctx.globalAlpha = 1;
  const mono = cssFont("--font-jbmono", "monospace");
  ctx.font = `500 19px ${mono}`;
  ctx.textAlign = "center";
  const words = publisher.toUpperCase().split(/\s+/).slice(0, 3);
  words.forEach((w, i) => ctx.fillText(w.slice(0, 7), W / 2, H - 96 + i * 24));

  // bóng nhẹ ở hai mép gáy cho cảm giác bo cong
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(0,0,0,0.28)");
  g.addColorStop(0.18, "rgba(0,0,0,0)");
  g.addColorStop(0.82, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  return toTexture(c, aniso);
}

/** Bìa sau: nền màu, ảnh bìa mờ làm hoạ tiết, khối chữ giới thiệu, mã vạch. */
export function backTexture(image: CanvasImageSource | null, color: string, seed: number, aniso: number) {
  const W = 320;
  const H = 454;
  const [c, ctx] = canvas(W, H);
  // nhiều bìa sau ngoài đời là nền trắng: cho xen kẽ để vòng sách không bị một màu
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

  // khối chữ giới thiệu
  ctx.fillStyle = fg;
  for (let i = 0; i < 9; i++) {
    const last = i === 8;
    ctx.fillRect(34, 70 + i * 15, last ? 90 + rand() * 80 : W - 68 - rand() * 26, 4);
  }

  // mã vạch
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

  // giá bìa
  ctx.fillStyle = fg;
  ctx.fillRect(34, H - 52, 54, 4);
  ctx.fillRect(34, H - 42, 34, 4);

  // nếp gấp sát gáy (ở bìa sau, gáy nằm bên phải khi nhìn từ sau)
  const g = ctx.createLinearGradient(W - 16, 0, W, 0);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.55, "rgba(255,255,255,0.1)");
  g.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = g;
  ctx.fillRect(W - 16, 0, 16, H);

  return toTexture(c, aniso);
}

/** Vẽ lại ảnh bìa trước kèm nếp gấp sát gáy, cho bìa có "bản lề" như sách thật. */
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

export { PAPER };
