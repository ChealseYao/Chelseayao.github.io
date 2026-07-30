// nyc 相册照片清单 —— 由 scripts/sync-photos.js 自动生成（meta 行除外），不要手动改其他部分
// 照片描述统一在 descriptions.js 里填
const GALLERY = {
  meta: { emoji:"🗽", title:"NYC", sub:"August 2024" },  // ← 手动改这行（emoji/标题/副标题），同步会保留
  dir: "../../photos/travels/202408-nyc/",
  photos: [
    { file:"20240809-01-nyc.jpg", date:"8.9.2024" },
    { file:"20240810-01-nyc.jpg", date:"8.10.2024" },
    { file:"20240810-02-nyc.jpg", date:"8.10.2024" },
    { file:"20240810-03-nyc.jpg", date:"8.10.2024" },
    { file:"20240811-01-nyc.jpg", date:"8.11.2024" },
    { file:"20240813-01-nyc.jpg", date:"8.13.2024" },
    { file:"20240814-01-nyc.jpg", date:"8.14.2024" },
  ],
};
