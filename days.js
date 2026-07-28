// Days Matter 倒数日
// 加新条目：date 用 "YYYY-MM-DD"，color 可用 var(--fly)/--jp/--cd/--sy/--dl/--bj 或任意色值
// 未来的日期显示"还有 X 天"，过去的显示"已经 X 天"，当天显示"就是今天 🎉"
const COUNTDOWNS = [
  { emoji:"🇨🇳", label:"Back to China",   date:"2026-12-05", color:"var(--cd)" },
  { emoji:"🎆", label:"New Year",        date:"2027-01-01", color:"var(--bj)" },
  { emoji:"💍", label:"Getting Married", date:"2025-05-21", color:"var(--jp)" },
  { emoji:"🐶", label:"With Alice",      date:"2025-03-26", color:"var(--dl)" },
  { emoji:"🎓", label:"Graduate",        date:"2025-05-15", color:"var(--sy)" },
];

(function(){
  const box = document.getElementById("countdowns");
  if (!box) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const fmt = d => `${d.getMonth()+1}.${d.getDate()}.${d.getFullYear()}`;

  COUNTDOWNS.forEach(c => {
    const [y,m,d] = c.date.split("-").map(Number);
    const target = new Date(y, m-1, d);
    const diff = Math.round((target - today) / 86400000);

    let numHTML, cls = "";
    if (diff > 0)       numHTML = `${diff}<small>days left</small>`;
    else if (diff < 0)  numHTML = `${-diff}<small>days since</small>`;
    else              { numHTML = `Today 🎉`; cls = "today"; }

    const el = document.createElement("div");
    el.className = "cd-item" + (cls ? " " + cls : "");
    el.innerHTML =
      `<span class="accent" style="background:${c.color}"></span>` +
      `<div class="cd-label"><span class="emoji">${c.emoji}</span>${c.label}</div>` +
      `<div class="cd-num">${numHTML}</div>` +
      `<div class="cd-date">${fmt(target)}</div>`;
    box.appendChild(el);
  });
})();
