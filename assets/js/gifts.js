// 伴手礼清单 —— 按家分组，一行一条，随时加
// who = 送给谁，what = 送什么，note = 备注（可留空 ""），done = 买好了改成 true
// 页面按这里的书写顺序显示，done 只改图标不改顺序
const GIFT_GROUPS = [
  {
    group: "Chelsea",
    items: [
      { who:"爸爸妈妈", what:"保健品", note:"Costco 购买", done:false },
      { who:"朵儿",     what:"🐦 始祖鸟包", note:"", done:true },
      { who:"童童",     what:"", note:"", done:false },
      { who:"伟皓",     what:"", note:"", done:false },
      { who:"恬恬",     what:"", note:"", done:false },
      { who:"Qinx",     what:"小酒杯 ➕ 🍫", note:"", done:true },
    ],
  },
  {
    group: "DKL",
    items: [
      { who:"爸爸妈妈",   what:"保健品", note:"Costco 购买", done:false },
      { who:"Dkl 妹妹 1", what:"🐦 始祖鸟包", note:"", done:true },
      { who:"Dkl 妹妹 2", what:"🐦 始祖鸟包", note:"", done:true },
    ],
  },
];

// 送礼思路 —— 想到新的就加一行
const GIFT_IDEAS = [
  "🍫 巧克力：See's Candies / Trader Joe's / Costco",
  "💊 保健品：Costco 鱼油 / 维生素 / 氨糖钙片",
  "🌿 花旗参：Wisconsin 西洋参（华人超市有礼盒装）",
  "🧴 护肤品 / 化妆品：免税店或 Sephora 节日套装",
  "👜 Outlet 轻奢小物：Coach / MK 卡包钱包",
  "🧢 户外品牌：始祖鸟 / Patagonia 帽子围巾小配件",
  "☕ Stanley 保温杯 / 星巴克城市限定杯",
];

(function(){
  const box = document.getElementById("gifts");
  if (!box) return;

  const all = GIFT_GROUPS.flatMap(g => g.items);
  document.getElementById("progress").textContent =
    `${all.filter(g => g.done).length} / ${all.length} ready`;

  GIFT_GROUPS.forEach(grp => {
    const sec = document.createElement("section");
    sec.className = "gift-group card";
    const gDone = grp.items.filter(g => g.done).length;
    sec.innerHTML = `<h2>${grp.group}<span class="gp">${gDone} / ${grp.items.length} ready</span></h2>`;
    grp.items.forEach(g => {
      const row = document.createElement("div");
      row.className = "gift" + (g.done ? " done" : "");
      row.innerHTML =
        `<span class="tick">${g.done ? "✅" : "⬜"}</span>` +
        `<span class="who">${g.who}</span>` +
        `<span class="what">${g.what || '<span class="tbd">thinking…</span>'}${g.note ? `<span class="note">${g.note}</span>` : ""}</span>`;
      sec.appendChild(row);
    });
    box.appendChild(sec);
  });

  // Gift Ideas
  const ideasBox = document.getElementById("ideas");
  if (ideasBox && GIFT_IDEAS.length){
    const sec = document.createElement("section");
    sec.className = "gift-group card";
    sec.innerHTML = `<h2>🤔 Gift Ideas</h2>` +
      GIFT_IDEAS.map(t => `<div class="idea">${t.replace(" ", "&ensp;")}</div>`).join("");
    ideasBox.appendChild(sec);
  }
})();
