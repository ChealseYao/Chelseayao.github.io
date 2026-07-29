// 相册页共用渲染逻辑（网格 + 灯箱）
// 每个相册页依次引入：descriptions.js（照片描述）→ 自己的照片清单（GALLERY）→ 本文件
(function(){
  const grid = document.getElementById("gallery");
  if (!grid || typeof GALLERY === "undefined") return;

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

  photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "ph";
    fig.innerHTML =
      `<img src="${p.src}" alt="${p.caption || ""}" loading="lazy" data-i="${i}">` +
      (p.caption || p.date
        ? `<figcaption>${p.caption || ""}${p.date ? `<span class="d">${p.date}</span>` : ""}</figcaption>`
        : "");
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
