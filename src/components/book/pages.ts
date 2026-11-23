/*
 * The printed matter of the book. Every face is typeset on a 2D canvas in the site's own faces and handed
 * to three.js as a texture. Pages are printed the way a real book is: fibres in the paper, a margin, running
 * heads and folios, a body of text, and the shadow the gutter throws on the inner edge of every page.
 */
import { nf, pad, percent } from "@/lib/format";

export type Leafed = { rank: number; name: string; publisher: string; count: number; cover: string | null; color: string };
export type Faces = { serif: string; mono: string; sans: string };

const PAPER = "#f4eee0";
const INK = "#1d1813";
const MUTE = "#7a7062";
const SHU = "#c9351c";
const CLOTH = "#b52d18";
const GOLD = "#e2c07a";
export const RATIO = 568 / 400;

const cssFont = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/** Makes sure the faces, and their Vietnamese slices, are in before anything is drawn. */
export async function loadFaces(sample: string): Promise<Faces> {
  const serif = cssFont("--font-fraunces", "serif");
  const mono = cssFont("--font-jbmono", "monospace");
  const sans = cssFont("--font-bevn", "sans-serif");
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`320 64px ${serif}`, sample),
        document.fonts.load(`italic 300 64px ${serif}`, sample),
        document.fonts.load(`400 20px ${mono}`, sample),
        document.fonts.load(`300 20px ${sans}`, sample),
      ]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch {}
  return { serif, mono, sans };
}

const sheet = (w: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = Math.round(w * RATIO);
  return [c, c.getContext("2d")!] as const;
};

const tracked = (ctx: CanvasRenderingContext2D, px: number) => {
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
};

/**
 * Paper: an off-white with fibres, warmer toward the edges, and the soft shadow of the gutter on the spine side.
 * `spine` says which edge of the image is bound.
 */
function paper(ctx: CanvasRenderingContext2D, w: number, h: number, spine: "left" | "right") {
  // Every page of a size and side shares one sheet: painting it costs tens of milliseconds, copying it almost nothing.
  const key = `${w}x${h}|${spine}`;
  let cached = papers.get(key);
  if (!cached) {
    cached = document.createElement("canvas");
    cached.width = w;
    cached.height = h;
    paintPaper(cached.getContext("2d")!, w, h, spine);
    papers.set(key, cached);
  }
  ctx.drawImage(cached, 0, 0);
}

const papers = new Map<string, HTMLCanvasElement>();
/** Lets go of the shared sheets once the book is gone. */
export const releasePaper = () => papers.clear();

function paintPaper(ctx: CanvasRenderingContext2D, w: number, h: number, spine: "left" | "right") {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = (0.15 + Math.random() * 0.3) * w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, Math.random() > 0.5 ? "rgba(214,190,140,0.05)" : "rgba(255,253,245,0.06)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  // The fibres, stroked as two paths (dark and light) rather than one stroke each.
  ctx.lineWidth = Math.max(0.6, w / 1600);
  const dark = new Path2D();
  const light = new Path2D();
  for (let i = 0; i < (w * h) / 2600; i++) {
    const x = Math.random() * w, y = Math.random() * h, a = Math.random() * Math.PI, l = 2 + Math.random() * (w / 140);
    const p = Math.random() > 0.35 ? dark : light;
    p.moveTo(x, y);
    p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
  }
  ctx.strokeStyle = "rgba(120,96,60,0.07)";
  ctx.stroke(dark);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.stroke(light);
  const e = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.78);
  e.addColorStop(0, "rgba(255,250,238,0)");
  e.addColorStop(1, "rgba(170,140,90,0.16)");
  ctx.fillStyle = e;
  ctx.fillRect(0, 0, w, h);
  const gx = spine === "left" ? 0 : w;
  const gutter = ctx.createLinearGradient(gx, 0, spine === "left" ? w * 0.2 : w * 0.8, 0);
  gutter.addColorStop(0, "rgba(70,50,25,0.42)");
  gutter.addColorStop(0.08, "rgba(70,50,25,0.2)");
  gutter.addColorStop(0.35, "rgba(70,50,25,0.05)");
  gutter.addColorStop(1, "rgba(70,50,25,0)");
  ctx.fillStyle = gutter;
  ctx.fillRect(0, 0, w, h);
  const fx = spine === "left" ? w : 0;
  const fore = ctx.createLinearGradient(fx, 0, spine === "left" ? w * 0.96 : w * 0.04, 0);
  fore.addColorStop(0, "rgba(120,96,60,0.16)");
  fore.addColorStop(1, "rgba(120,96,60,0)");
  ctx.fillStyle = fore;
  ctx.fillRect(0, 0, w, h);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, lines: number) {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= max || !line) line = next;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  if (out.length > lines) {
    out.length = lines;
    let last = out[lines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > max) last = last.slice(0, -1);
    out[lines - 1] = `${last.trimEnd()}…`;
  }
  return out;
}

/** Justified body text, the way a book sets it, the last line left ragged. */
function body(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lead: number, lines = 99) {
  const rows = wrap(ctx, text, width, lines);
  rows.forEach((row, r) => {
    const words = row.split(" ");
    if (r === rows.length - 1 || words.length < 2) {
      ctx.fillText(row, x, y + r * lead);
      return;
    }
    const total = words.reduce((s, wd) => s + ctx.measureText(wd).width, 0);
    const gap = (width - total) / (words.length - 1);
    let cx = x;
    for (const wd of words) {
      ctx.fillText(wd, cx, y + r * lead);
      cx += ctx.measureText(wd).width + gap;
    }
  });
  return y + rows.length * lead;
}

const label = (ctx: CanvasRenderingContext2D, f: Faces, u: number, text: string, x: number, y: number, align: CanvasTextAlign = "left") => {
  ctx.font = `400 ${u * 2}px ${f.mono}`;
  tracked(ctx, u * 0.28);
  ctx.textAlign = align;
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.textAlign = "left";
  tracked(ctx, 0);
};

/** Running head and folio, on the outer side of the page. */
function furniture(ctx: CanvasRenderingContext2D, f: Faces, u: number, w: number, h: number, spine: "left" | "right", head: string, folio: number) {
  ctx.fillStyle = MUTE;
  const outer = spine === "left" ? w - u * 11 : u * 11;
  const align = spine === "left" ? "right" : "left";
  label(ctx, f, u, head, outer, u * 10, align);
  label(ctx, f, u, String(folio), outer, h - u * 7, align);
}

/**
 * The front board: red book cloth, the title stamped in gold foil.
 * Returns the colour, a roughness/metalness map (G and B channels, as three.js reads them) and a bump map.
 */
export function paintCover(w: number, f: Faces, period: string, votes: number) {
  const [color, c] = sheet(w);
  const [orm, o] = sheet(w);
  const [bump, b] = sheet(w);
  const h = color.height;
  const u = w / 100;

  c.fillStyle = CLOTH;
  c.fillRect(0, 0, w, h);
  o.fillStyle = "rgb(0,235,0)";
  o.fillRect(0, 0, w, h);
  b.fillStyle = "#808080";
  b.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 2) {
    const v = 124 + Math.random() * 12;
    b.fillStyle = `rgb(${v},${v},${v})`;
    b.fillRect(0, y, w, 1);
  }
  b.globalAlpha = 0.5;
  for (let x = 0; x < w; x += 2) {
    const v = 122 + Math.random() * 14;
    b.fillStyle = `rgb(${v},${v},${v})`;
    b.fillRect(x, 0, 1, h);
  }
  b.globalAlpha = 1;
  const wear = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.72);
  wear.addColorStop(0, "rgba(0,0,0,0)");
  wear.addColorStop(1, "rgba(60,10,0,0.28)");
  c.fillStyle = wear;
  c.fillRect(0, 0, w, h);

  const stamp = (draw: (ctx: CanvasRenderingContext2D) => void) => {
    c.fillStyle = c.strokeStyle = GOLD;
    draw(c);
    o.fillStyle = o.strokeStyle = "rgb(0,90,255)";
    draw(o);
    b.fillStyle = b.strokeStyle = "#3a3a3a";
    draw(b);
  };
  stamp((ctx) => {
    ctx.lineWidth = Math.max(1, u * 0.32);
    ctx.strokeRect(u * 7, u * 7, w - u * 14, h - u * 14);
    ctx.lineWidth = Math.max(1, u * 0.12);
    ctx.strokeRect(u * 8.4, u * 8.4, w - u * 16.8, h - u * 16.8);
  });
  stamp((ctx) => {
    label(ctx, f, u, "Ấn bản độc giả", u * 13, u * 17);
    label(ctx, f, u, period, w - u * 13, u * 17, "right");
  });
  stamp((ctx) => {
    let y = h * 0.36;
    const size = u * 12.5;
    for (const [text, italic] of [
      ["Bảng xếp hạng", false],
      ["Light Novel", true],
      ["Việt Nam.", false],
    ] as const) {
      ctx.font = `${italic ? "italic 300" : "320"} ${size}px ${f.serif}`;
      tracked(ctx, -size * 0.045);
      ctx.fillText(text, u * 12, y);
      y += size * 0.98;
    }
    tracked(ctx, 0);
  });
  stamp((ctx) => {
    ctx.fillRect(u * 13, h - u * 25, u * 10, Math.max(1, u * 0.3));
    label(ctx, f, u, `${nf.format(votes)} lá phiếu`, u * 13, h - u * 18.5);
    label(ctx, f, u, "Do độc giả Việt Nam bình chọn", u * 13, h - u * 14.2);
  });
  return { color, orm, bump };
}

/** The half-title on the left of the first spread. */
export function paintTitle(w: number, f: Faces, period: string, votes: number, count: number) {
  const [cv, ctx] = sheet(w);
  const h = cv.height;
  const u = w / 100;
  paper(ctx, w, h, "right");
  ctx.fillStyle = MUTE;
  label(ctx, f, u, period, w / 2, h * 0.24, "center");
  const s = u * 9.4;
  const lines: [string, boolean][] = [
    ["Bảng xếp hạng", false],
    ["Light Novel", true],
    ["Việt Nam", false],
  ];
  lines.forEach(([t, it], i) => {
    ctx.fillStyle = it ? SHU : INK;
    ctx.font = `${it ? "italic 300" : "320"} ${s}px ${f.serif}`;
    tracked(ctx, -s * 0.03);
    ctx.textAlign = "center";
    ctx.fillText(t, w / 2, h * 0.36 + i * s * 1.05);
  });
  tracked(ctx, 0);
  ctx.fillStyle = INK;
  ctx.fillRect(w / 2 - u * 4, h * 0.58, u * 8, Math.max(1, u * 0.2));
  ctx.font = `italic 300 ${u * 4}px ${f.serif}`;
  ctx.textAlign = "center";
  ctx.fillText(`${count} cái tên dẫn đầu, do độc giả chọn`, w / 2, h * 0.65);
  ctx.fillStyle = MUTE;
  label(ctx, f, u, `${nf.format(votes)} lá phiếu hợp lệ`, w / 2, h * 0.86, "center");
  ctx.textAlign = "left";
  return cv;
}

/** The contents page: the places, a dotted leader, a page number. */
export function paintContents(w: number, f: Faces, items: Leafed[], period: string) {
  const [cv, ctx] = sheet(w);
  const h = cv.height;
  const u = w / 100;
  paper(ctx, w, h, "left");
  furniture(ctx, f, u, w, h, "left", period, 3);
  ctx.fillStyle = INK;
  const s = u * 13;
  ctx.font = `320 ${s}px ${f.serif}`;
  tracked(ctx, -s * 0.04);
  ctx.fillText("Mục", u * 13, u * 32);
  const mw = ctx.measureText("Mục ").width;
  ctx.fillStyle = SHU;
  ctx.font = `italic 300 ${s}px ${f.serif}`;
  ctx.fillText("lục.", u * 13 + mw, u * 32);
  tracked(ctx, 0);

  ctx.fillStyle = INK;
  ctx.font = `300 ${u * 2.9}px ${f.sans}`;
  body(ctx, "Những cuốn sách được độc giả gọi tên nhiều nhất kỳ này, xếp từ hạng thấp tới hạng cao theo thứ tự lật trang.", u * 13, u * 42, w - u * 24, u * 4.4, 3);

  const sorted = [...items].sort((a, b) => b.rank - a.rank);
  const top = u * 62;
  const row = (h - top - u * 16) / sorted.length;
  sorted.forEach((e, i) => {
    const y = top + row * i + row * 0.5;
    ctx.fillStyle = e.rank === 1 ? SHU : INK;
    ctx.font = `320 ${u * 6.4}px ${f.serif}`;
    ctx.fillText(pad(e.rank), u * 13, y);
    ctx.fillStyle = INK;
    ctx.font = `320 ${u * 3.8}px ${f.serif}`;
    const name = wrap(ctx, e.name, u * 50, 1)[0];
    ctx.fillText(name, u * 26, y);
    const nw = ctx.measureText(name).width;
    ctx.font = `400 ${u * 2.6}px ${f.mono}`;
    const folio = String(i * 2 + 5);
    const fw = ctx.measureText(folio).width;
    ctx.fillStyle = MUTE;
    ctx.fillText(folio, w - u * 11 - fw, y);
    label(ctx, f, u, e.publisher, u * 26, y + u * 4);
    ctx.fillStyle = "rgba(29,24,19,0.3)";
    for (let x = u * 26 + nw + u * 2; x < w - u * 13 - fw; x += u * 1.7) ctx.fillRect(x, y - u * 0.4, u * 0.34, u * 0.34);
  });
  return cv;
}

/** A right-hand page of the ranking: the place, the name, a paragraph, the count. */
export function paintEntry(w: number, f: Faces, e: Leafed, votes: number, max: number, period: string, folio: number) {
  const [cv, ctx] = sheet(w);
  const h = cv.height;
  const u = w / 100;
  paper(ctx, w, h, "left");
  furniture(ctx, f, u, w, h, "left", `Hạng ${pad(e.rank)} · ${period}`, folio);

  const big = u * 50;
  ctx.fillStyle = SHU;
  ctx.font = `320 ${big}px ${f.serif}`;
  tracked(ctx, -big * 0.06);
  ctx.fillText(pad(e.rank), u * 10, u * 14 + big * 0.84);
  tracked(ctx, 0);

  const ts = u * 7.2;
  ctx.fillStyle = INK;
  ctx.font = `320 ${ts}px ${f.serif}`;
  tracked(ctx, -ts * 0.03);
  let y = u * 14 + big * 0.84 + u * 12;
  for (const l of wrap(ctx, e.name, w - u * 25, 3)) {
    ctx.fillText(l, u * 13, y);
    y += ts * 1.06;
  }
  tracked(ctx, 0);
  ctx.fillStyle = MUTE;
  label(ctx, f, u, e.publisher, u * 13, y + u * 0.5);

  ctx.fillStyle = INK;
  ctx.font = `300 ${u * 2.9}px ${f.sans}`;
  const share = percent(e.count, votes);
  const text =
    e.rank === 1
      ? `${nf.format(e.count)} độc giả đã viết tên cuốn sách này lên lá phiếu, ${share} tổng số phiếu của kỳ, nhiều hơn bất kỳ cuốn nào khác. Đây là cuốn sách được yêu thích nhất ${period}.`
      : `${nf.format(e.count)} độc giả đã viết tên cuốn sách này lên lá phiếu, chiếm ${share} tổng số phiếu của kỳ. Cuốn sách đứng thứ ${e.rank} trong số những tác phẩm được gọi tên ${period}, do ${e.publisher} phát hành.`;
  body(ctx, text, u * 13, y + u * 9, w - u * 25, u * 4.4, 5);

  const foot = h - u * 17;
  ctx.fillStyle = "rgba(29,24,19,0.08)";
  ctx.fillRect(u * 13, foot, w - u * 25, u * 1.2);
  ctx.fillStyle = e.color;
  ctx.fillRect(u * 13, foot, (w - u * 25) * (e.count / max), u * 1.2);
  const ns = u * 10;
  ctx.fillStyle = INK;
  ctx.font = `320 ${ns}px ${f.serif}`;
  tracked(ctx, -ns * 0.035);
  ctx.fillText(nf.format(e.count), u * 13, foot - u * 3.5);
  const nw = ctx.measureText(nf.format(e.count)).width;
  tracked(ctx, 0);
  ctx.fillStyle = MUTE;
  label(ctx, f, u, "phiếu", u * 13 + nw + u * 2.5, foot - u * 3.8);
  label(ctx, f, u, `${share} độc giả`, w - u * 12, foot - u * 3.8, "right");
  return cv;
}

/** A left-hand plate: the book's own cover tipped onto the page, with a caption. */
export function paintPlate(w: number, f: Faces | null, e: Leafed, img: HTMLImageElement | null, folio: number) {
  const [cv, ctx] = sheet(w);
  const h = cv.height;
  const u = w / 100;
  paper(ctx, w, h, "right");
  const dw = w - u * 28;
  const dh = dw * RATIO;
  const dx = u * 12;
  const top = u * 15;
  ctx.save();
  ctx.shadowColor = "rgba(60,40,20,0.35)";
  ctx.shadowBlur = u * 2.2;
  ctx.shadowOffsetX = u * 0.4;
  ctx.shadowOffsetY = u * 0.8;
  ctx.fillStyle = e.color;
  ctx.fillRect(dx, top, dw, dh);
  ctx.restore();
  if (img) {
    const s = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
    const sw = dw / s, sh = dh / s;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, dx, top, dw, dh);
  }
  if (f) {
    ctx.fillStyle = MUTE;
    label(ctx, f, u, `Hình ${pad(e.rank)}`, dx, top + dh + u * 6);
    ctx.fillStyle = INK;
    ctx.font = `italic 300 ${u * 3.2}px ${f.serif}`;
    ctx.fillText(wrap(ctx, e.name, dw, 1)[0], dx, top + dh + u * 10.5);
    furniture(ctx, f, u, w, h, "right", "Bảng xếp hạng Light Novel", folio);
  }
  return cv;
}

/** The fore-edge of a block of pages: fine uneven lines, darker toward the boards. */
export function paintEdge(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ede4d2";
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 2) {
    ctx.fillStyle = `rgba(90,70,40,${0.1 + Math.random() * 0.2})`;
    ctx.fillRect(0, y, w, 1);
  }
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(60,40,20,0.22)");
  g.addColorStop(0.2, "rgba(60,40,20,0)");
  g.addColorStop(0.8, "rgba(60,40,20,0)");
  g.addColorStop(1, "rgba(60,40,20,0.3)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  return c;
}

/** A tile of paper fibre for the bump map: the tooth that catches a raking light. */
export function paintTooth(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  // Written straight into the pixels: tens of thousands of fillRect calls took longer than the rest of the book.
  const img = ctx.createImageData(size, size);
  const d = img.data;
  d.fill(128);
  for (let i = 0; i < size * size * 0.6; i++) {
    const v = 128 + (Math.random() - 0.5) * 40;
    const y = (Math.random() * size) | 0;
    const x0 = (Math.random() * size) | 0;
    const len = 1 + ((Math.random() * 2) | 0);
    for (let x = x0; x < Math.min(size, x0 + len); x++) {
      const k = (y * size + x) * 4;
      d[k] = d[k + 1] = d[k + 2] = v;
    }
  }
  for (let k = 3; k < d.length; k += 4) d[k] = 255;
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Plain paper, for faces nobody reads. */
export function paintBlank(w: number, spine: "left" | "right" = "left") {
  const [cv, ctx] = sheet(w);
  paper(ctx, w, cv.height, spine);
  return cv;
}
