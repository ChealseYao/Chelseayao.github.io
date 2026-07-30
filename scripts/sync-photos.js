#!/usr/bin/env node
// 扫描 photos/ 下所有相册文件夹，自动同步照片清单和描述文件：
//   - assets/js/photos/<相册>.js     纯自动生成（文件名 + 日期），不要手动改
//   - assets/js/photos/descriptions.js  照片描述（key: value，全部相册），只有 value 手动填，
//     脚本会自动补新照片的 key、删掉已不存在的，你填过的描述原样保留
//   - 新相册文件夹会自动生成清单和相册页（主页卡片需要手动加）
// 用法：node scripts/sync-photos.js  （GitHub Action 在每次 push 后也会自动跑）
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LISTS = path.join(ROOT, "assets", "js", "photos");
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

// 收集相册：photos/moments/<名字>、photos/travels/<YYYYMM-名字>
const albums = [];
for (const group of ["moments", "travels"]) {
  const groupDir = path.join(ROOT, "photos", group);
  if (!fs.existsSync(groupDir)) continue;
  for (const folder of fs.readdirSync(groupDir)) {
    const dir = path.join(groupDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    const name = group === "travels" ? folder.replace(/^\d{6}-/, "") : folder;
    const files = fs.readdirSync(dir).filter(f => IMG_RE.test(f)).sort();
    // 相册页在 pages/<模块>/ 下（两层深），所以照片路径带 ../../
    albums.push({ name, group, folder, files, rel: `../../photos/${group}/${folder}/` });
  }
}

const fmtDate = f => {
  const m = f.match(/^(\d{4})(\d{2})(\d{2})/);
  return m ? `${+m[2]}.${+m[3]}.${m[1]}` : "";
};

// ---- 相册清单（自动生成；meta 行手动改、同步保留） ----
for (const a of albums) {
  const listPath = path.join(LISTS, `${a.name}.js`);

  // meta：已有则原样保留（emoji/标题/副标题是手动定的），没有则按文件夹生成默认值
  let metaLine = null;
  if (fs.existsSync(listPath)) {
    const m = fs.readFileSync(listPath, "utf8").match(/^\s*meta:\s*\{.*\},.*$/m);
    if (m) metaLine = m[0];
  }
  if (!metaLine) {
    const title = a.name[0].toUpperCase() + a.name.slice(1);
    const ym = a.folder.match(/^(\d{4})(\d{2})-/);
    const sub = ym ? `${MONTHS[+ym[2] - 1]} ${ym[1]}` : "";
    const emoji = a.group === "travels" ? "🌍" : "📷";
    metaLine = `  meta: { emoji:"${emoji}", title:"${title}", sub:"${sub}" },  // ← 手动改这行（emoji/标题/副标题），同步会保留`;
  }

  const rows = a.files.map(f =>
    `    { file:${JSON.stringify(f)}, date:"${fmtDate(f)}" },`
  ).join("\n");
  fs.writeFileSync(listPath,
    `// ${a.name} 相册照片清单 —— 由 scripts/sync-photos.js 自动生成（meta 行除外），不要手动改其他部分\n` +
    `// 照片描述统一在 descriptions.js 里填\n` +
    `const GALLERY = {\n${metaLine}\n  dir: "${a.rel}",\n  photos: [\n${rows}\n  ],\n};\n`);
  console.log(`✓ ${a.name}.js（${a.files.length} 张）`);

  // 新相册：生成通用空壳相册页（标题/副标题由数据文件的 meta 渲染）
  const pageDir = path.join(ROOT, "pages", a.group);
  fs.mkdirSync(pageDir, { recursive: true });
  const pagePath = path.join(pageDir, `${a.name}.html`);
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chelsea</title>
<link rel="stylesheet" href="../../assets/css/base.css">
<link rel="stylesheet" href="../../assets/css/gallery.css">
</head>
<body>
<div class="wrap">

  <header>
    <a class="home-link" href="../../index.html"><span class="arr">👈</span> Home</a>
    <h1 id="gtitle"></h1>
    <div class="sub" id="gsub"></div>
  </header>

  <div id="gallery"></div>

</div>
<script src="../../assets/js/photos/descriptions.js"></script>\n<script src="../../assets/js/photos/${a.name}.js"></script>
<script src="../../assets/js/gallery.js"></script>
<script src="../../assets/js/scroll-restore.js"></script>
</body>
</html>
`);
    console.log(`  ➕ 新相册页 ${a.name}.html 已生成（emoji/标题在 ${a.name}.js 的 meta 行改，主页卡片手动加）`);
  }
}

// ---- descriptions.js（覆盖所有相册；key 自动维护，value 手动填、永远保留） ----
const momentsAlbums = albums;
const descPath = path.join(LISTS, "descriptions.js");
const kept = {};
if (fs.existsSync(descPath)) {
  const old = fs.readFileSync(descPath, "utf8");
  for (const m of old.matchAll(/^\s*"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)"/gm)) {
    kept[JSON.parse(`"${m[1]}"`)] = JSON.parse(`"${m[2]}"`);
  }
}
const sections = momentsAlbums.map(a =>
  `  // ── ${a.name} ──\n` +
  a.files.map(f => `  ${JSON.stringify(f)}: ${JSON.stringify(kept[f] || "")},`).join("\n")
).join("\n\n");
fs.writeFileSync(descPath,
  `// 照片描述（所有相册）—— 想给哪张照片配字，就在它的引号里写（留空则不显示）\n` +
  `// key（文件名）由 scripts/sync-photos.js 自动维护，你只管填 value\n` +
  `const DESCRIPTIONS = {\n${sections}\n};\n`);
console.log(`✓ descriptions.js（${momentsAlbums.reduce((n, a) => n + a.files.length, 0)} 个 key）`);
