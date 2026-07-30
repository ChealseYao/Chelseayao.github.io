// 相册页共用渲染逻辑（网格 + 灯箱）
// 每个相册页依次引入：descriptions.js（照片描述）→ 自己的照片清单（GALLERY）→ 本文件
(function(){
  const grid = document.getElementById("gallery");
  if (!grid || typeof GALLERY === "undefined") return;

  // 页头由数据文件的 meta 驱动（emoji / 标题 / 副标题），页面本身是通用空壳
  const m = GALLERY.meta || {};
  const gt = document.getElementById("gtitle");
  if (gt && m.title){
    gt.innerHTML = `${m.emoji ? m.emoji + "&ensp;" : ""}${m.title}`;
    document.title = `${m.title} · Chelsea`;
  }
  const gs = document.getElementById("gsub");
  if (gs && m.sub) gs.textContent = m.sub;

  const desc = typeof DESCRIPTIONS !== "undefined" ? DESCRIPTIONS : {};
  const photos = GALLERY.photos.map(p => ({
    ...p,
    src: GALLERY.dir + p.file,
    caption: desc[p.file] || p.caption || "",
  }));

  if (photos.length === 0){
    grid.innerHTML = '<div class="empty">No photos yet 🖼️</div>';
    return;
  }

  // 统一布局（所有相册）：日期靠左、描述靠右；窄屏时描述提行并左对齐
  photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "ph";
    fig.innerHTML =
      `<img src="${p.src}" alt="${p.caption || ""}" loading="lazy" data-i="${i}">` +
      `<figcaption class="trav"><span class="d">${p.date || "\u00A0"}</span><span class="cap">${p.caption || ""}</span></figcaption>`;
    grid.appendChild(fig);
  });

  // lightbox
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML = `<button class="nav prev">‹</button><img><button class="nav next">›</button><div class="cap"></div>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".cap");
  let cur = 0;

  function show(i){
    cur = (i + photos.length) % photos.length;
    const p = photos[cur];
    lbImg.src = p.src;
    lbCap.textContent = [p.caption, p.date].filter(Boolean).join(" · ");
    lb.classList.add("open");
  }
  grid.addEventListener("click", e => {
    if (e.target.tagName === "IMG") show(+e.target.dataset.i);
  });
  lb.addEventListener("click", e => {
    if (e.target.classList.contains("prev")) show(cur - 1);
    else if (e.target.classList.contains("next")) show(cur + 1);
    else lb.classList.remove("open");
  });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();
