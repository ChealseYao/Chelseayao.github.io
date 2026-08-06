// 答谢宴 PLAN —— 按 时间 → 地点 → 策划 组织，每块下面若干小节
// 条目写法：字符串 = 未完成；完成后改成 { t:"条目", done:true }
const WEDDING_PLAN = [
  {
    title: "⏰&ensp;Time",
    color: "var(--cd)",
    venues: [
      { city:"🐼 成都", date:"12.12 – 12.13（待定）" },
      { city:"❄️ 沈阳", date:"12.20 ✅" },
    ],
    sections: [],
  },
  {
    title: "📍&ensp;Venue",
    color: "var(--bj)",
    scout: true,   // 酒店考察内容挂在这一块下面
    sections: [],
  },
  {
    title: "🎨&ensp;Planning",
    color: "var(--jp)",
    sections: [
      { name:"🎪&ensp;Decor",       items:["宴会布置", "流程安排", "花艺"] },
      { name:"📷&ensp;Photography", items:["跟拍摄影师", "摄像（optional）"] },
      { name:"👨‍👩‍👧‍👦&ensp;Guests",  items:["Guest List", "座位安排"] },
      { name:"🍽️&ensp;Catering",    items:["菜单确认", "酒水饮料"] },
    ],
  },
  {
    title: "👰&ensp;Wedding Photos",
    color: "var(--dl)",
    sections: [
      { name:"", items:["棚拍 ×2", "红底证件照 ×1"] },
    ],
  },
];

// 成都答谢宴酒店考察（2026.08）—— 数据改这里，页面自动渲染
const VENUE_SCOUT = {
  title: "🏨&ensp;成都酒店考察",
  note: "2026.08 · 12 月档期",
  medals: ["🥇", "🥈", "🥉", "4️⃣"],   // 按 hotels 顺序即排名
  hotels: [
    {
      name: "盛美利亚", rec: "⭐⭐⭐⭐⭐",
      photos: [   // 路径相对 pages/plan/wedding.html
        { src: "../../assets/img/wedding/melia-entrance.jpg",  alt: "酒店正门" },
        { src: "../../assets/img/wedding/melia-aerial.jpg",    alt: "锦城湖畔全貌" },
        { src: "../../assets/img/wedding/melia-lake.jpg",      alt: "临湖俯瞰" },
        { src: "../../assets/img/wedding/melia-courtyard.jpg", alt: "茶厅户外庭院" },
      ],
      meta: ["档次 ⭐⭐⭐⭐⭐", "价格 $$$$", "LED ✅", "停车 ⭐⭐⭐⭐⭐"],
      price: "宴席 ¥6200/桌起 · 包房 ¥800–850/间带休息厅",
      keys: ["🎪 场地：独立宴会厅约 300㎡（100 人 / 约 10 桌），层高 4.5m，含户外区 + 酒吧，私密性好，动线顺畅",
             "🌳 环境：锦城湖畔，庭院漂亮，宾客可去湖边逛",
             "🅿️ 停车：独立地上/地下车库，免费",
             "🎁 赠送：饮料 ×4、甜品 ×100、矿泉水",
             "🍵 茶水：单点 ¥30/人（全员 ≈ ¥2000），¥1.5 万包厅不划算、不考虑"],
      pros: ["仪式感最好", "动线最佳", "LED/投影齐全", "迎宾区宽敞", "停车免费"],
      cons: ["价格相对较高"],
    },
    {
      name: "华尔道夫 Waldorf Astoria", rec: "⭐⭐⭐⭐☆",
      photos: [
        { src: "../../assets/img/wedding/waldorf-ballroom.jpg", alt: "宴会厅" },
      ],
      meta: ["档次 ⭐⭐⭐⭐⭐", "价格 $$$$$", "LED ❌", "停车 ⭐⭐⭐"],
      price: "餐标 ¥5888/桌起 · 客房 ¥1500/间起（湖景/院景、双床/大床）",
      keys: ["⚖️ 对比：餐标比盛美利亚低约 ¥400/桌，客房贵 ¥700–800/间",
             "🌃 厅1 扇形厅：100㎡，可看双子塔夜景；已订 2–3 桌仍可安排、建议 4–5 桌（5 桌就局促）；中间大柱子只能放 KT 板、不能搭台",
             "🎪 厅2 细长厅：约 200㎡，无投影、带固定景观，可摆约 10 桌；有窗但晚上看不到双子塔夜景；灯光吊顶像普通会议室，无舞台/LED",
             "🏟️ 大厅：1000+㎡，可增约 6 桌、收隔断可扩展、可搭舞台；化妆间/茶水间捆绑这个大厅一起卖，没卖出去才能用",
             "🛏️ 包房：即客房，分湖景/院景、双床/大床；休息厅化妆间和宴会厅在一起",
             "🅿️ 停车：与 in99 共用，车场太大难找位"],
      pros: ["档次/品牌最高", "扇形厅有双子塔夜景", "餐标比盛美利亚低"],
      cons: ["客房最贵（¥1500 起）", "两个厅都无舞台/LED", "扇形厅有柱子、5 桌局促", "化妆间茶水间没保障", "停车难找位"],
    },
    {
      name: "首座万豪（in99 对面）", rec: "⭐⭐⭐⭐☆",
      photos: [
        { src: "../../assets/img/wedding/marriott-ballroom.jpg", alt: "宴会厅实拍" },
      ],
      meta: ["档次 ⭐⭐⭐", "价格 $$", "LED ❌", "停车 ⭐⭐⭐"],
      price: "餐标 ¥4000/桌起 · 客房约 ¥900/间",
      keys: ["📅 档期：12 月目前全空；一二楼均可，容纳 200–300 人",
             "🎪 场地：推荐 6–8 桌，10 桌以下可包场；舞台/布置需自己搭建",
             "🅿️ 停车：与写字楼共用地下车库，免费 2 小时",
             "🎁 赠送：下午茶甜点 + 饮料",
             "🌳 环境：周围就是街道，没有特别的卖点"],
      pros: ["性价比最高", "无场地费", "客房便宜（¥900）", "商圈位置好"],
      cons: ["酒店档次一般", "布置要自己搭建", "无景观卖点", "停车只免 2 小时"],
    },
    {
      name: "木棉花酒店", rec: "⭐⭐⭐",
      meta: ["档次 ⭐⭐⭐⭐", "价格 $$$", "LED ❌", "停车 ⭐⭐⭐"],
      price: "宴席约 ¥53xx/桌起 · 服务费约 ¥200",
      keys: ["🎪 场地：可做婚房 + 化妆间",
             "🅿️ 停车：万达附近，共用停车场",
             "🎁 赠送：饮料"],
      pros: ["环境不错", "品牌较好"],
      cons: ["无 LED", "无茶水间", "动线一般（需绕新升降机）"],
    },
  ],
  checklist: [
    "最低起订桌数", "保底消费", "场地费", "服务费", "开瓶费", "是否可自带酒水",
    "是否可自带甜品/伴手礼", "是否赠送婚房/休息室", "是否赠送签到台", "是否赠送迎宾牌",
    "是否赠送 LED/投影/音响", "是否提供舞台", "是否提供试菜", "停车优惠政策",
    "定金比例", "退款政策", "档期保留时间", "布置限制（鲜花/背景板/气球等）",
  ],
};

(function(){
  const box = document.getElementById("plan");
  if (!box) return;

  const norm = it => typeof it === "string" ? { t: it, done: false } : it;

  // 图片浮窗：点酒店照片放大，点任意处 / ✕ / Esc 关闭
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<span class="lb-x">✕</span><img alt="">`;
  document.body.appendChild(lb);
  lb.addEventListener("click", () => lb.classList.remove("on"));
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("on"); });
  box.addEventListener("click", e => {
    const img = e.target.closest(".hphotos img");
    if (!img) return;
    lb.querySelector("img").src = img.src;
    lb.classList.add("on");
  });

  WEDDING_PLAN.forEach(block => {
    const items = block.sections.flatMap(s => s.items.map(norm));
    const done = items.filter(i => i.done).length;

    const sec = document.createElement("section");
    sec.className = "block card";
    const pct = items.length ? Math.round(done / items.length * 100) : 0;
    sec.innerHTML =
      `<span class="accent" style="background:${block.color || "var(--sy)"}"></span>` +
      `<h2>${block.title}${items.length ? `<span class="gp">${done} / ${items.length} done</span>` : ""}</h2>` +
      (items.length ? `<div class="gbar"><i style="width:${pct}%;background:${block.color || "var(--sy)"}"></i></div>` : "") +
      (block.venues ? `<div class="venues">${block.venues.map(v =>
        `<span class="venue"><b>${v.city}</b> · <span class="vd${v.date.includes("待定") ? " tbd" : ""}">${v.date}</span></span>`).join("")}</div>` : "");

    const grid = document.createElement("div");
    grid.className = "secs";
    block.sections.forEach(s => {
      const col = document.createElement("div");
      col.className = "sec";
      col.innerHTML =
        (s.name ? `<div class="sname">${s.name}</div>` : "") +
        s.items.map(norm).map(i =>
          `<div class="item${i.done ? " done" : ""}">${i.done ? '<span class="tick">✓</span>' : ""}${i.t}</div>`
        ).join("");
      grid.appendChild(col);
    });
    sec.appendChild(grid);
    // 酒店考察内容并进"地点"块
    if (block.scout) sec.insertAdjacentHTML("beforeend", scoutHTML());
    box.appendChild(sec);
  });

  function scoutHTML(){
    const s = VENUE_SCOUT;
    return `<div class="ckhead">${s.title}<span class="cknote">${s.note}</span></div>` +
      `<div class="hotels">` + s.hotels.map((h, hi) =>
        `<div class="hotel">` +
        `<div class="hname"><span class="hmedal">${s.medals[hi]}</span>${h.name}<span class="hrec">${h.rec}</span></div>` +
        (h.photos ? `<div class="hphotos">${h.photos.map(p =>
          `<img src="${p.src}" alt="${p.alt}" title="${p.alt}" loading="lazy">`).join("")}</div>` : "") +
        `<div class="hmeta">${h.meta.map(m => {
          const sp = m.indexOf(" ");
          const val = m.slice(sp + 1).replace(/(\$+)/, '<b class="dollars">$1</b>');
          return `<span class="mcell"><span class="ml">${m.slice(0, sp)}</span><span class="mv">${val}</span></span>`;
        }).join("")}</div>` +
        `<div class="hprice"><span class="hpico">💰</span><div class="hplines">${h.price.split(" · ").map(p => `<div>${p}</div>`).join("")}</div></div>` +
        h.keys.map(k => `<div class="hkey">${k}</div>`).join("") +
        `<div class="hpros">${h.pros.map(p => `<span>✅ ${p}</span>`).join("")}</div>` +
        `<div class="hcons">${h.cons.map(c => `<span>❌ ${c}</span>`).join("")}</div>` +
        `</div>`).join("") +
      `</div>` +
      `<div class="ckhead">📋&ensp;To Confirm</div>` +
      `<div class="cklist">${s.checklist.map(c => `<div class="ck">□ ${c}</div>`).join("")}</div>`;
  }
})();
