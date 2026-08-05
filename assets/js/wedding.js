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
      meta: ["档次 ⭐⭐⭐⭐⭐", "价格 $$$$", "LED ✅", "停车 ⭐⭐⭐⭐⭐"],
      price: "宴席 ¥6200/桌起 · 包房 ¥800–850/间带休息厅",
      keys: ["锦城湖畔，独立宴会厅 + 户外区 + 酒吧，私密性好；庭院漂亮，宾客可去湖边逛",
             "宴会厅约 300㎡，容纳 100 人（约 10 桌），层高 4.5m，可迎宾/签到，动线顺畅",
             "独立地上/地下停车场，免费",
             "赠饮料约 4 瓶、甜品约 100 份、矿泉水",
             "茶水单点 ¥30/人 更划算（人少，全员喝也就 ¥2000）；包断茶水厅 ¥1.5 万不考虑"],
      pros: ["仪式感最好", "动线最佳", "LED/投影齐全", "迎宾区宽敞", "停车免费"],
      cons: ["价格相对较高"],
    },
    {
      name: "华达道夫 Waldorf Astoria", rec: "⭐⭐⭐⭐☆",
      meta: ["档次 ⭐⭐⭐⭐⭐", "价格 $$$$$", "LED ❌", "停车 ⭐⭐⭐⭐⭐"],
      price: "宴席约 ¥5xxx/桌起 · 自助约 ¥5888 起 · 包房约 ¥1500/间",
      keys: ["厅1 灵活（已订 2–3 桌仍可安排，建议 4–5 桌）",
             "厅2 无投影、带固定景观，可摆约 10 桌",
             "大厅可增约 6 桌，收隔断可扩展，可搭舞台"],
      pros: ["档次/品牌最高", "适合正式宴会", "停车方便"],
      cons: ["价格最高", "LED 配套一般"],
    },
    {
      name: "天街酒店（银泰 in99 对面）", rec: "⭐⭐⭐⭐☆",
      meta: ["档次 ⭐⭐⭐", "价格 $$", "LED ✅", "停车 ⭐⭐⭐⭐⭐"],
      price: "无场地费 · 菜单 3/4/5/6PPP（价格待确认）",
      keys: ["12 月档期目前全空；一二楼均可，容纳 200–300 人",
             "推荐 6–8 桌，10 桌以下可包场；LED/投影/音响齐全",
             "同楼层大量车位；赠下午茶甜点 + 饮料"],
      pros: ["性价比最高", "免费场地", "设备齐全", "商圈位置好"],
      cons: ["酒店档次一般", "豪华感不如五星"],
    },
    {
      name: "木棉花酒店", rec: "⭐⭐⭐",
      meta: ["档次 ⭐⭐⭐⭐", "价格 $$$", "LED ❌", "停车 ⭐⭐⭐"],
      price: "宴席约 ¥53xx/桌起 · 服务费约 ¥200",
      keys: ["万达附近，共用停车场", "可做婚房 + 化妆间；赠饮料"],
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
