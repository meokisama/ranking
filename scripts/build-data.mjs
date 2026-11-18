// Chuẩn hoá dữ liệu thô (data/raw) -> src/data, tải ảnh bìa về public/covers.
// Chạy: npm run data
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "data/raw");
const OUT = path.join(ROOT, "src/data");
const COVERS = path.join(ROOT, "public/covers");

const readJson = async (p) => JSON.parse(await fs.readFile(path.join(RAW, p), "utf8"));

// i.docln.net đã ngừng hoạt động, i.hako.vip phục vụ cùng đường dẫn.
const fixHost = (url) => url.replace(/\/\/i\d?\.docln\.net\//, "//i.hako.vip/");
const coverKey = (url) => path.basename(new URL(url).pathname).replace(/\.\w+$/, "");

const coverMeta = new Map(); // key -> { file, color } | null
const queue = new Map(); // key -> url

const want = (url) => {
  if (!url) return null;
  const key = coverKey(url);
  queue.set(key, fixHost(url));
  return key;
};

const toHex = ({ r, g, b }) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// Màu nhấn của bìa: điểm ảnh rực nhất (bỏ qua vùng quá sáng / quá tối).
async function accent(buf) {
  const { data } = await sharp(buf).resize(12, 16, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let best = { r: 120, g: 110, b: 100 };
  let score = -1;
  for (let i = 0; i < data.length; i += 3) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (max + min) / 510;
    const s = (max - min) / 255 * (1 - Math.abs(lum - 0.5) * 1.4);
    if (s > score) { score = s; best = { r, g, b }; }
  }
  return toHex(best);
}

async function fetchCover(key, url) {
  const file = path.join(COVERS, `${key}.webp`);
  try {
    let buf;
    try {
      buf = await fs.readFile(file);
    } catch {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const src = Buffer.from(await res.arrayBuffer());
      buf = await sharp(src)
        .resize({ width: 400, height: 568, fit: "cover", position: "top" })
        .webp({ quality: 72 })
        .toBuffer();
      await fs.writeFile(file, buf);
    }
    coverMeta.set(key, { file: `/covers/${key}.webp`, color: await accent(buf) });
  } catch (err) {
    console.warn("  ! thiếu bìa:", url, String(err.message ?? err));
    coverMeta.set(key, null);
  }
}

async function downloadAll() {
  await fs.mkdir(COVERS, { recursive: true });
  const jobs = [...queue.entries()];
  let i = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const [key, url] = jobs[i++];
      await fetchCover(key, url);
      if (i % 40 === 0) console.log(`  ${i}/${jobs.length}`);
    }
  };
  await Promise.all(Array.from({ length: 10 }, worker));
}

const book = (e) => ({
  id: e._id,
  name: e.ranobe.seriesName.trim(),
  publisher: e.ranobe.publisherName.trim(),
  coverKey: want(e.ranobe.coverUrl),
  count: e.count,
});

const publisher = (e) => ({
  id: e._id,
  name: e.publisher.publisherName.trim(),
  logo: `/images/publisher/${e.publisher.publisherLogo}.webp`,
  count: e.count,
});

const illustrator = (e) => ({
  id: e._id,
  name: e.illustrator.name.trim(),
  works: e.illustrator.series.map((s) => s.seriesTitle.trim()),
  coverKey: want(e.illustrator.series[0]?.coverUrl),
  count: e.count,
});

const byCount = (a, b) => b.count - a.count;

const resolve = (list) =>
  list.sort(byCount).map(({ coverKey: key, ...rest }, i) => {
    const meta = key ? coverMeta.get(key) : null;
    return { rank: i + 1, ...rest, cover: meta?.file ?? null, color: meta?.color ?? null };
  });

async function main() {
  const h1 = (await readJson("first_half_2024.json")).data;
  const h2 = (await readJson("second_half_2024.json")).data;
  const voteRanobe = await readJson("vote_ranobe.json");
  const votePublisher = await readJson("vote_publisher.json");

  const p1 = {
    ranobe: h1.favoriteRanobes.map(book),
    illustrator: h1.favoriteIllustrators.map(illustrator),
    publisher: h1.favoritePublishers.map(publisher),
  };
  const p2 = {
    ranobe: h2.favoriteRanobes.map(book),
    oneshot: h2.favoriteOneshots.map(book),
    rookie: h2.favoriteRookies.map(book),
    publisher: h2.favoritePublishers.map(publisher),
  };
  const voteBooks = voteRanobe.map((r) => ({
    id: r.id,
    name: r.seriesName.trim(),
    publisher: r.publisherName.trim(),
    coverKey: want(r.coverUrl),
  }));

  console.log(`Tải ${queue.size} ảnh bìa…`);
  await downloadAll();
  const missing = [...coverMeta.values()].filter((v) => !v).length;
  console.log(`Xong. Thiếu ${missing}/${queue.size} bìa.`);

  // Tuổi: gom các giá trị hợp lệ 10–40, phần còn lại coi là nhiễu.
  const ages = {};
  for (const { _id, count } of h2.age) {
    const a = Math.round(_id);
    if (a >= 10 && a <= 40) ages[a] = (ages[a] ?? 0) + count;
  }
  const gender = Object.fromEntries(h2.gender.map((g) => [g._id, g.count]));

  const periods = [
    {
      slug: "2-2024",
      label: "Kỳ II · 2024",
      long: "Nửa cuối năm 2024",
      votes: h2.count,
      gender,
      ages: Object.entries(ages).map(([age, count]) => ({ age: +age, count })),
      categories: Object.fromEntries(Object.entries(p2).map(([k, v]) => [k, resolve(v)])),
    },
    {
      slug: "1-2024",
      label: "Kỳ I · 2024",
      long: "Nửa đầu năm 2024",
      votes: h1.count,
      gender: null,
      ages: null,
      categories: Object.fromEntries(Object.entries(p1).map(([k, v]) => [k, resolve(v)])),
    },
  ];

  const ROOKIE = [2, 6, 13, 17, 19, 22, 24, 38, 39, 40, 41, 43, 47];
  const ONESHOT = new Set(h2.favoriteOneshots.map((e) => e._id));
  const vote = {
    books: voteBooks
      .map(({ coverKey: key, ...rest }) => {
        const meta = key ? coverMeta.get(key) : null;
        return {
          ...rest,
          cover: meta?.file ?? null,
          color: meta?.color ?? null,
          rookie: ROOKIE.includes(rest.id),
          oneshot: ONESHOT.has(rest.id),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    publishers: votePublisher.map((p) => ({
      id: p.id,
      name: p.publisherName,
      logo: `/images/publisher/${p.publisherLogo}.webp`,
    })),
  };

  // Góp ý: bỏ IP và id, chỉ giữ nội dung.
  const feedback = [];
  for (const [file, period] of [
    ["feedback/second_half_2024.json", "2-2024"],
    ["feedback/first_half_2024.json", "1-2024"],
  ]) {
    const rows = await readJson(file);
    for (const r of rows) {
      const f = r.feedback ?? {};
      const clean = (s) => (s ?? "").trim();
      if (!clean(f.topic) && !clean(f.content)) continue;
      feedback.push({
        period,
        topic: clean(f.topic),
        content: clean(f.content),
        title: clean(f.title),
        publisher: clean(f.publisher),
        at: r.createdAt,
      });
    }
  }
  feedback.sort((a, b) => (a.at < b.at ? 1 : -1));

  await fs.mkdir(OUT, { recursive: true });
  const write = (name, data) =>
    fs.writeFile(path.join(OUT, name), JSON.stringify(data, null, 1) + "\n");
  await write("periods.json", periods);
  await write("vote.json", vote);
  await write("feedback.json", feedback);
  console.log("Đã ghi src/data/{periods,vote,feedback}.json");
}

main();
