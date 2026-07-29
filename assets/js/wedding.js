// 答谢宴 + 领证 PLAN —— 分三大块，每块下面若干小节
// 条目写法：字符串 = 未完成；完成后改成 { t:"条目", done:true }
const WEDDING_PLAN = [
  {
    title: "🍽️ 答谢宴",
    venues: [
      { city:"🐼 成都", date:"12.12 – 12.13（待定）" },
      { city:"❄️ 沈阳", date:"12.20 ✅" },
    ],
    sections: [
      { name:"📍 场地",   items:["宴会场地", "日期", "定金"] },
      { name:"🎨 策划",   items:["宴会布置", "流程安排", "花艺"] },
      { name:"📷 摄影",   items:["跟拍摄影师", "摄像（optional）"] },
      { name:"👨‍👩‍👧‍👦 宾客", items:["Guest List", "座位安排"] },
      { name:"🍽️ 餐饮",   items:["菜单确认", "酒水饮料"] },
    ],
  },
  {
    title: "💒 领证",
    sections: [
      { name:"📍 地点",     items:["Appointment", "确认所需材料（dkl 证明材料）"] },
      { name:"📸 证件照",   items:["成都拍红底证件照"] },
      { name:"📷 跟拍",     items:["预约摄影师"] },
    ],
  },
  {
    title: "👰 婚纱照",
    sections: [
      { name:"", items:["棚拍 ×2", "红底证件照 ×1"] },
    ],
  },
];

(function(){
  const box = document.getElementById("plan");
  if (!box) return;

  const norm = it => typeof it === "string" ? { t: it, done: false } : it;
  const all = WEDDING_PLAN.flatMap(b => b.sections.flatMap(s => s.items.map(norm)));
  document.getElementById("progress").textContent =
    `${all.filter(i => i.done).length} / ${all.length} done`;

  WEDDING_PLAN.forEach(block => {
    const items = block.sections.flatMap(s => s.items.map(norm));
    const done = items.filter(i => i.done).length;

    const sec = document.createElement("section");
    sec.className = "block card";
    sec.innerHTML = `<h2>${block.title}<span class="gp">${done} / ${items.length} done</span></h2>` +
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
          `<div class="item${i.done ? " done" : ""}">${i.done ? '<span class="tick">✅</span>' : ""}${i.t}</div>`
        ).join("");
      grid.appendChild(col);
    });
    sec.appendChild(grid);
    box.appendChild(sec);
  });
})();
