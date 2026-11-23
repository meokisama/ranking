/*
 * The book, in three.js. One cloth-bound hardback holds the leading names: it floats closed beside the title,
 * comes down onto the table as the reader scrolls, opens at its middle on a half-title and a contents page,
 * and turns one leaf per place. Each spread prints that book's cover as a plate on the left and its entry on the right.
 *
 * The boards are rigid and hinge on the spine; the front board carries the front half of the pages with it,
 * so the open book has a block of paper on both sides. Lying open, every page rises out of the gutter in the
 * curve a bound page makes, and the blocks under them take the same curve. Turning leaves are a grid bent on the
 * CPU: the spine leads, the free edge trails, the near corner a little ahead of the far one. Leaves cast shadows
 * on the pages beneath them. Scroll position alone decides the state, so scrolling back turns the pages back.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { loadFaces, paintBlank, paintContents, paintCover, paintEdge, paintEntry, paintPlate, paintTitle, paintTooth, releasePaper } from "./pages";
import type { Faces, Leafed } from "./pages";

export type BookScene = {
  /** 0..1 scroll progress through the pinned hero. */
  setProgress(p: number): void;
  /** Width in px kept free on each side of the open book (for the side columns). */
  setInset(px: number): void;
  /** Called when the visible spread changes: -2 closed, -1 contents, 0.. the entries from the lowest place up. */
  onSpread: ((entry: number) => void) | null;
  dispose(): void;
};

/** Share of the scroll spent on the closed book. */
const INTRO = 0.12;
/** A little rest after the last page, so the first place can be read before the book is left behind. */
const TAIL = 0.35;

/** Scroll progress at which entry `i` (0 = the lowest place) of `n` lies fully open. */
export const progressOfEntry = (i: number, n: number) => INTRO + ((i + 2) / (n + 1 + TAIL)) * (1 - INTRO);

const W = 1;
const D = 1.42;
const BOARD = 0.024;
const LAYER = 0.0034;
const BLOCK = 0.06; // each half of the paper, without the leaves that turn
const HUMP = 0.034; // how high an open page rises out of the gutter
const NX = 48;
const NZ = 8;
const FOV = 30;
const PITCH = 0.9;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));
/** The profile of an open page: out of the gutter steeply, over a shoulder, down to the fore-edge. */
const hump = (s: number) => HUMP * (1 - Math.exp(-s * 13)) * (1 - Math.pow(Math.min(1, s / W), 3));

function leafGeometry() {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array((NX + 1) * (NZ + 1) * 3);
  const uv = new Float32Array((NX + 1) * (NZ + 1) * 2);
  for (let j = 0; j <= NZ; j++)
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i;
      uv[k * 2] = i / NX;
      uv[k * 2 + 1] = 1 - j / NZ;
    }
  const index: number[] = [];
  for (let j = 0; j < NZ; j++)
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  g.setIndex(index);
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

/**
 * Bends a leaf. `q` is how far it has turned (0 on the right, 1 on the left); `y0`/`y1` its resting heights;
 * `open` how far the book is open (the pages only take their curve once it lies flat); `stiff` 0..1 damps the curl.
 */
function bend(g: THREE.BufferGeometry, q: number, y0: number, y1: number, open: number, stiff = 0) {
  const p = g.attributes.position.array as Float32Array;
  const th = Math.PI * q;
  const lag = Math.min(th, Math.PI - th) * 1.25 * (1 - stiff);
  const flat = 1 - Math.sin(th);
  const y = y0 + (y1 - y0) * easeInOut(q);
  for (let j = 0; j <= NZ; j++) {
    const v = j / NZ;
    const l = lag * (1 - 0.5 * (v - 0.5));
    const a = th + l * 0.5;
    const c = -l / W;
    for (let i = 0; i <= NX; i++) {
      const s = (i / NX) * W;
      let px: number, py: number;
      if (Math.abs(c) < 1e-5) {
        px = s * Math.cos(a);
        py = s * Math.sin(a);
      } else {
        px = (Math.sin(a + c * s) - Math.sin(a)) / c;
        py = (Math.cos(a) - Math.cos(a + c * s)) / c;
      }
      py += flat * hump(s) * open;
      const k = (j * (NX + 1) + i) * 3;
      p[k] = px;
      p[k + 1] = y + py;
      p[k + 2] = (v - 0.5) * D;
    }
  }
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}

/** A block of pages whose upper face can take the curve of an open page. */
function blockGeometry(height: number) {
  const shape = new THREE.Shape();
  const steps = 40;
  shape.moveTo(0, 0);
  shape.lineTo(W - 0.01, 0);
  for (let i = steps; i >= 0; i--) shape.lineTo((i / steps) * (W - 0.01), height);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: D - 0.014, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -(D - 0.014) / 2);
  const base = Float32Array.from(g.attributes.position.array as Float32Array);
  return { g, base, height };
}
function curveBlock(b: ReturnType<typeof blockGeometry>, open: number) {
  const p = b.g.attributes.position.array as Float32Array;
  for (let k = 0; k < p.length; k += 3) {
    if (Math.abs(b.base[k + 1] - b.height) > 1e-6) continue;
    p[k + 1] = b.height + hump(b.base[k]) * open;
  }
  b.g.attributes.position.needsUpdate = true;
  b.g.computeBoundingSphere();
}

export function createBookScene(canvas: HTMLCanvasElement, items: Leafed[], meta: { period: string; votes: number }): BookScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    console.warn("[book]", e);
    return null;
  }
  const N = items.length;
  const TURNS = N + 1;
  const SEGMENTS = TURNS + TAIL;
  const LEAVES = N + 1;

  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The canvas fills the viewport, so on a large screen the device pixel ratio alone can mean seven or eight
  // million pixels a frame. Hold it to a budget, and step it down further if frames come in slow.
  const BUDGET = small ? 2.2e6 : 4.8e6;
  let quality = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  /** Set whenever something on screen changes outside the scroll and pointer: a page printed, a resize. */
  let dirty = true;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.42;
  room.dispose();

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);

  // A warm window light raking in low from the upper left, so the curve of every page shows.
  const sun = new THREE.DirectionalLight(0xfff0da, 2.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -2.4; sc.right = 2.4; sc.top = 2.4; sc.bottom = -2.4; sc.near = 0.5; sc.far = 12;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.01;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xc9b994, 0.6));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ color: 0x2a1c0e, opacity: 0.2 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -BOARD - 0.002;
  ground.receiveShadow = true;
  scene.add(ground);
  const blobTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.55, "rgba(0,0,0,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: blobTex, color: 0x2a1c0e, transparent: true, depthWrite: false, opacity: 0.3 })
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = ground.position.y + 0.001;
  scene.add(blob);

  // ---- textures ----
  const tex = (src: HTMLCanvasElement, color = true) => {
    const t = new THREE.Texture(src);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.needsUpdate = true;
    return t;
  };
  const TEXT = small ? 900 : 1400;
  const blankR = tex(paintBlank(256, "left"));
  const blankL = tex(paintBlank(256, "right"));
  const weave = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(64, 64);
    for (let y = 0; y < 64; y++)
      for (let x = 0; x < 64; x++) {
        const v = 128 + ((x + y) % 2 ? 22 : -22) + (Math.random() - 0.5) * 30;
        const k = (y * 64 + x) * 4;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
        img.data[k + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(40, 40);
    return t;
  })();
  const tooth = tex(paintTooth(256), false);
  tooth.wrapS = tooth.wrapT = THREE.RepeatWrapping;
  tooth.repeat.set(5, 7);
  const edgeTex = (() => {
    const t = tex(paintEdge(64, 512));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.rotation = Math.PI / 2;
    t.repeat.set(20, 1);
    return t;
  })();
  const capTex = (() => {
    const t = tex(paintEdge(64, 512));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 20);
    return t;
  })();

  // ---- materials ----
  const cloth = new THREE.MeshStandardMaterial({ color: 0xb02c17, roughness: 0.88, bumpMap: weave, bumpScale: 0.6 });
  // The cover starts with stand-in maps of every kind it will have, so printing it later does not rebuild the shader.
  const pixel = (r: number, g: number, b: number) => {
    const t = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1);
    t.needsUpdate = true;
    return t;
  };
  const coverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 1, bumpScale: 0.8 });
  coverMat.map = tex(paintBlank(64));
  coverMat.roughnessMap = coverMat.metalnessMap = pixel(0, 255, 0);
  coverMat.bumpMap = pixel(128, 128, 128);
  const sidesMat = new THREE.MeshStandardMaterial({ map: edgeTex, roughness: 0.95, side: THREE.DoubleSide });
  const capsMat = new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.95, side: THREE.DoubleSide });
  const pageMat = (map: THREE.Texture, side: THREE.Side) =>
    new THREE.MeshStandardMaterial({ map, roughness: 0.94, bumpMap: tooth, bumpScale: 0.35, side });

  // ---- the book ----
  const book = new THREE.Group();
  const body = new THREE.Group(); // spine at x = 0, pages toward +x
  book.add(body);
  scene.add(book);
  const shadowy = <T extends THREE.Mesh>(m: T) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const back = shadowy(new THREE.Mesh(new RoundedBoxGeometry(W + 0.034, BOARD, D + 0.05, 2, 0.006), cloth));
  back.position.set((W + 0.034) / 2 - 0.006, -BOARD / 2, 0);
  body.add(back);

  const right = blockGeometry(BLOCK);
  const rightBlock = shadowy(new THREE.Mesh(right.g, [capsMat, sidesMat]));
  rightBlock.position.x = 0.004;
  body.add(rightBlock);

  // Closed, from the bottom: back board, right block, the leaves that turn, the front leaf, the left block, the front board.
  const stack = BLOCK + (LEAVES + 1) * LAYER;
  const topClosed = stack + BLOCK + 0.001;
  const spineH = topClosed + 2 * BOARD;
  const spine = shadowy(new THREE.Mesh(new RoundedBoxGeometry(0.034, spineH, D + 0.05, 2, 0.012), cloth));
  body.add(spine);

  const hinge = new THREE.Group();
  body.add(hinge);
  const cover = shadowy(new THREE.Mesh(new THREE.BoxGeometry(W + 0.034, BOARD, D + 0.05), [cloth, cloth, coverMat, cloth, cloth, cloth]));
  cover.position.set((W + 0.034) / 2 - 0.006, BOARD / 2, 0);
  hinge.add(cover);
  const left = blockGeometry(BLOCK);
  const leftBlock = shadowy(new THREE.Mesh(left.g, [capsMat, sidesMat]));
  leftBlock.position.x = 0.004;
  leftBlock.scale.y = -1; // hangs under the front board, its curved face down until the board turns over
  hinge.add(leftBlock);
  const titleGeo = (() => {
    const g = new THREE.BufferGeometry();
    const nx = 40;
    const pos = new Float32Array((nx + 1) * 2 * 3);
    const uv = new Float32Array((nx + 1) * 2 * 2);
    for (let j = 0; j < 2; j++)
      for (let i = 0; i <= nx; i++) {
        const k = j * (nx + 1) + i;
        // read from above once the board has turned over: the fore-edge (local x = W) is the left of the page
        uv[k * 2] = 1 - i / nx;
        uv[k * 2 + 1] = 1 - j;
      }
    const index: number[] = [];
    for (let i = 0; i < nx; i++) {
      const a = i, b = i + 1, c = i + nx + 1, d = c + 1;
      index.push(a, b, c, b, d, c);
    }
    g.setIndex(index);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return { g, nx };
  })();
  const titleMat = new THREE.MeshStandardMaterial({ map: blankL, roughness: 0.82, bumpMap: tooth, bumpScale: 0.35, side: THREE.DoubleSide });
  const titlePage = shadowy(new THREE.Mesh(titleGeo.g, titleMat));
  titlePage.position.x = 0.004;
  titlePage.frustumCulled = false;
  hinge.add(titlePage);
  const shapeTitle = (open: number) => {
    const p = titleGeo.g.attributes.position.array as Float32Array;
    const nx = titleGeo.nx;
    for (let j = 0; j < 2; j++)
      for (let i = 0; i <= nx; i++) {
        const x = (i / nx) * (W - 0.012);
        const k = (j * (nx + 1) + i) * 3;
        p[k] = x;
        p[k + 1] = -(BLOCK + hump(x) * open) - 0.0008; // just proud of the block's face
        p[k + 2] = (j - 0.5) * (D - 0.016);
      }
    titleGeo.g.attributes.position.needsUpdate = true;
    titleGeo.g.computeVertexNormals();
    titleGeo.g.computeBoundingSphere();
  };
  shapeTitle(0);

  type Leaf = { geo: THREE.BufferGeometry; front: THREE.MeshStandardMaterial; back: THREE.MeshStandardMaterial; key: string };
  const mkLeaf = (): Leaf => {
    const geo = leafGeometry();
    const front = pageMat(blankR, THREE.FrontSide);
    const backMat = pageMat(blankL, THREE.BackSide);
    const a = shadowy(new THREE.Mesh(geo, front));
    const b = shadowy(new THREE.Mesh(geo, backMat));
    a.frustumCulled = b.frustumCulled = false;
    body.add(a, b);
    return { geo, front, back: backMat, key: "" };
  };
  const leaves = Array.from({ length: LEAVES }, mkLeaf);

  // The back of a leaf is read from the other side, so its texture runs the other way across.
  const mirrored = (t: THREE.Texture) => {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;
    return t;
  };

  // ---- printing ----
  let dead = false;
  const order = [...items].sort((a, b) => b.rank - a.rank); // the lowest place first
  const max = Math.max(...items.map((e) => e.count));
  let faces: Faces | null = null;
  const images: (HTMLImageElement | null)[] = order.map(() => null);
  // Swapping one map for another of the same kind keeps the shader, so no needsUpdate on the material.
  const setMap = (m: THREE.MeshStandardMaterial, t: THREE.Texture) => {
    if (m.map && m.map !== blankL && m.map !== blankR) m.map.dispose();
    m.map = t;
    dirty = true;
  };
  /** Sends a freshly painted texture to the GPU now, in its own slot, rather than in the next frame that draws it. */
  const upload = (t: THREE.Texture) => {
    renderer.initTexture(t);
    return t;
  };

  // Each page takes tens of milliseconds to typeset, so they are printed one at a time in the browser's idle
  // slots, in the order the reader meets them: the cover first, the last place's leaves last.
  const queue: (() => void)[] = [];
  const queued = new Set<string>();
  let pumping = false;
  const idle: (cb: () => void) => void =
    "requestIdleCallback" in window ? (cb) => window.requestIdleCallback(cb, { timeout: 400 }) : (cb) => setTimeout(cb, 16);
  const pump = () => {
    if (dead) return;
    const job = queue.shift();
    if (!job) return void (pumping = false);
    job();
    idle(pump);
  };
  const print = (key: string, job: () => void) => {
    if (queued.has(key)) return;
    queued.add(key);
    queue.push(() => {
      queued.delete(key);
      if (!dead) job();
    });
    if (!pumping) {
      pumping = true;
      idle(pump);
    }
  };

  const printPlate = (i: number) =>
    print(`plate${i}`, () => setMap(leaves[i].back, upload(mirrored(tex(paintPlate(TEXT, faces, order[i], images[i], 4 + i * 2))))));
  order.forEach((e, i) => {
    if (!e.cover) return;
    const img = new Image();
    img.src = e.cover;
    // Decoded off the main thread; printed once the type is in, or now if it already is.
    img.decode().then(
      () => {
        if (dead) return;
        images[i] = img;
        if (faces) printPlate(i);
      },
      () => {}
    );
  });
  loadFaces(items.map((e) => e.name).join(" ") + " Bảng xếp hạng Việt Nam Mục lục PHIẾU ĐỘC GIẢ HẠNG Ấn bản").then((f) => {
    if (dead) return;
    faces = f;
    print("cover", () => {
      const c = paintCover(TEXT, f, meta.period, meta.votes);
      for (const t of [coverMat.map, coverMat.roughnessMap, coverMat.bumpMap]) t?.dispose();
      coverMat.map = upload(tex(c.color));
      coverMat.roughnessMap = coverMat.metalnessMap = upload(tex(c.orm, false));
      coverMat.bumpMap = upload(tex(c.bump, false));
      dirty = true;
    });
    print("title", () => {
      titleMat.map = upload(tex(paintTitle(TEXT, f, meta.period, meta.votes, N)));
      dirty = true;
    });
    print("contents", () => setMap(leaves[0].front, upload(tex(paintContents(TEXT, f, order, meta.period)))));
    order.forEach((e, i) => {
      print(`entry${i}`, () => setMap(leaves[i + 1].front, upload(tex(paintEntry(TEXT, f, e, meta.votes, max, meta.period, 5 + i * 2)))));
      printPlate(i);
    });
  });

  // ---- size, visibility, pointer ----
  let w = 1, h = 1, inset = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.75 : 2);
    renderer.setPixelRatio(Math.max(1, Math.min(dpr, Math.sqrt(BUDGET / (w * h))) * quality));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    dirty = true;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    dirty = true;
  });
  io.observe(canvas);

  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let progress = 0;
  let shown = 0;
  let time = 0;
  let last = performance.now();
  let reported = -3;
  let curved = -1;
  let lastShown = -1;
  let lastPx = NaN;
  let lastPy = NaN;
  const SUN = new THREE.Vector3(-3.2, 3.6, 1.6);

  const api: BookScene = {
    setProgress(p) {
      progress = clamp01(p);
    },
    setInset(px) {
      if (px !== inset) dirty = true;
      inset = px;
    },
    onSpread: null,
    dispose() {
      dead = true;
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        for (const mat of ([] as THREE.Material[]).concat(m.material)) {
          for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      releasePaper();
    },
  };

  const eye = new THREE.Vector3();
  const target = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  const rightV = new THREE.Vector3();
  const up = new THREE.Vector3();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");

  // Frame pacing, for stepping the resolution down on a machine that cannot keep up.
  let slowSum = 0;
  let slowCount = 0;

  const frame = (now: number) => {
    const raw = (now - last) / 1000;
    const dt = Math.min(0.05, raw);
    last = now;
    if (!visible || document.hidden) return;
    time += reduced ? 0 : dt;
    shown = reduced ? progress : damp(shown, progress, 7, dt);
    if (Math.abs(progress - shown) < 1e-5) shown = progress;
    ptr.x = damp(ptr.x, ptr.tx, 3, dt);
    ptr.y = damp(ptr.y, ptr.ty, 3, dt);
    if (Math.abs(ptr.tx - ptr.x) < 1e-4) ptr.x = ptr.tx;
    if (Math.abs(ptr.ty - ptr.y) < 1e-4) ptr.y = ptr.ty;

    // Nothing moves once the scroll and the pointer have caught up, except the closed book's slow float:
    // leave the last frame on screen instead of drawing it again.
    const floating = !reduced && smooth(0, INTRO * 0.92, shown) < 1;
    const still = shown === lastShown && ptr.x === lastPx && ptr.y === lastPy;
    if (!dirty && !floating && still) {
      slowCount = slowSum = 0;
      return;
    }
    dirty = false;
    lastShown = shown;
    lastPx = ptr.x;
    lastPy = ptr.y;

    // Only frames drawn back to back say anything about speed.
    if (raw < 0.1) {
      slowSum += raw;
      if (++slowCount === 45) {
        if (slowSum / slowCount > 0.024 && quality > 0.6) {
          quality = Math.max(0.6, quality - 0.15);
          resize();
        }
        slowSum = slowCount = 0;
      }
    }

    const p = shown;
    // The pages turn straight on from one another: no rest between them, one leaf per stretch of scroll.
    const t = Math.min(TURNS, Math.max(0, ((p - INTRO) / (1 - INTRO)) * SEGMENTS));
    const qc = clamp01(t);
    const open = smooth(0.55, 1, qc); // the pages take their curve as the book comes to lie open
    const settle = smooth(0, INTRO * 0.92, p);
    const k = 1 - settle;

    const n = Math.round(t);
    const spread = n === 0 ? -2 : n === 1 ? -1 : n - 2;
    if (spread !== reported) {
      reported = spread;
      api.onSpread?.(spread);
    }

    // ---- camera: fixed above the table, framed so the open book fits between the side columns ----
    const aspect = w / h;
    const free = Math.max(0.35, (w - inset * 2) / w);
    const tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dist = Math.max(1.3 / (tanH * aspect * free), (0.84 * Math.sin(PITCH)) / tanH, 3.1);
    target.set(0, 0.02, 0.05);
    eye.set(0, target.y + Math.sin(PITCH) * dist, target.z + Math.cos(PITCH) * dist);
    camera.position.copy(eye);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    fwd.subVectors(target, eye).normalize();
    rightV.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);

    // ---- pose: held up beside the title at first, then laid on the table and read ----
    const wide = aspect > 1;
    const near = dist * (wide ? 0.16 : 0.2);
    const halfW = (dist - near) * tanH * aspect;
    const halfH = (dist - near) * tanH;
    const sx = wide ? 0.47 * halfW : 0;
    const sy = wide ? 0.11 * halfH : 0.36 * halfH;
    const float = Math.sin(time * 0.8) * 0.03 * k;
    book.position
      .copy(target)
      .addScaledVector(fwd, -near * k)
      .addScaledVector(rightV, sx * k)
      .addScaledVector(up, (sy + float) * k);
    book.position.y -= target.y * settle;
    const s = wide ? 0.74 + 0.26 * settle : 0.95 + 0.05 * settle;
    book.scale.setScalar(s);
    euler.set(
      (0.62 + ptr.y * 0.14) * k + ptr.y * 0.025 * settle,
      (0.36 - ptr.x * 0.32 + Math.sin(time * 0.5) * 0.05) * k + ptr.x * 0.03 * settle,
      (-0.12 + Math.sin(time * 0.6) * 0.015) * k
    );
    book.quaternion.setFromEuler(euler);
    body.position.x = -(W / 2) * (1 - qc);

    // ---- the front board and the half of the pages it carries ----
    const lift = 1 - smooth(0.35, 1, qc);
    hinge.position.set(0, topClosed * lift, 0);
    hinge.rotation.z = Math.PI * easeInOut(qc);
    const sh = spineH - (spineH - BOARD * 0.9) * smooth(0, 0.7, qc);
    spine.scale.y = sh / spineH;
    spine.position.set(-0.012, -BOARD + sh / 2, 0);
    if (Math.abs(open - curved) > 1e-4) {
      curveBlock(right, open);
      curveBlock(left, open);
      shapeTitle(open);
      curved = open;
    }

    // ---- the leaves ----
    for (let j = 0; j < LEAVES; j++) {
      const q = clamp01(t - (j + 1));
      const L = leaves[j];
      const key = `${q.toFixed(5)}|${open.toFixed(4)}`;
      if (key === L.key) continue;
      bend(L.geo, q, BLOCK + (LEAVES - 1 - j + 0.5) * LAYER, BLOCK + (j + 1.5) * LAYER, open);
      L.key = key;
    }

    // ---- light and shadow follow the book ----
    blob.position.x = book.position.x + 0.1 * settle;
    blob.position.z = book.position.z + 0.04;
    blob.scale.set((1.5 + 1.25 * qc * settle) * s, 1, 1.85 * s);
    (blob.material as THREE.MeshBasicMaterial).opacity = 0.32 * settle;
    sun.target.position.copy(book.position);
    sun.position.copy(book.position).add(SUN);

    renderer.render(scene, camera);
  };

  // Build every shader before the first frame (in parallel where the driver allows), so the first frame
  // does not stall on compiling them.
  renderer
    .compileAsync(scene, camera)
    .catch(() => {})
    .then(() => {
      if (dead) return;
      last = performance.now();
      renderer.setAnimationLoop(frame);
    });

  return api;
}
