// 机票候选清单 —— 按航段分组，一个候选航程一张卡片，方便对比挑选
// airline = 航司，flight = 航班号，time = 起飞-落地时间
// prices = 价格日志：每次查价加一条 { on:"月.日", price:数字 }，卡片显示最新价和涨跌趋势
// note = 备注（转机、行李等，可留空 ""），pick = 最终选定改成 true（卡片会高亮 ⭐）
const FLIGHT_GROUPS = [
  {
    route: "LAX → 🇯🇵 Tokyo",
    date: "12.4 – 12.6 · 跨日界线",
    options: [
      { airline:"American Airlines", code:"AA", color:"#3b6fb5", flight:"", time:"11:45pm – 5:05am (+2)",
        tags:["Nonstop 12h 20m","HND"], note:"", prices:[{ on:"7.28", price:1119 }], pick:false },
      { airline:"JAL", code:"JL", color:"#c23b39", flight:"", time:"11:45pm – 5:05am (+2)",
        tags:["Nonstop 12h 20m","HND","AA 执飞"], note:"同一班机的代码共享票", prices:[{ on:"7.28", price:1243 }], pick:false },
      { airline:"Alaska", code:"AS", color:"#27556e", flight:"", time:"11:45pm – 5:05am (+2)",
        tags:["Nonstop 12h 20m","HND","AA 执飞"], note:"同一班机的代码共享票", prices:[{ on:"7.28", price:1239 }], pick:false },
    ],
  },
  {
    route: "🇯🇵 Tokyo → 🐼 成都",
    date: "12.8 · 落地 CTU 天府",
    options: [],
  },
  {
    route: "🐼 成都 → LAX",
    date: "1.2 – 1.3 · 到家 🏠",
    options: [],
  },
];

(function(){
  const box = document.getElementById("flights");
  if (!box) return;

  const all = FLIGHT_GROUPS.flatMap(g => g.options);
  const picked = all.filter(o => o.pick).length;
  document.getElementById("progress").textContent =
    `${all.length} option${all.length === 1 ? "" : "s"} · ${picked} / ${FLIGHT_GROUPS.length} picked`;

  FLIGHT_GROUPS.forEach(grp => {
    const sec = document.createElement("section");
    sec.className = "leg";
    sec.innerHTML = `<h2>${grp.route}<span class="gd">${grp.date}</span></h2>`;

    const grid = document.createElement("div");
    grid.className = "opts";
    if (grp.options.length === 0){
      grid.innerHTML = '<div class="empty">还没有候选航班</div>';
    } else {
      grp.options.forEach(o => {
        const card = document.createElement("div");
        card.className = "opt" + (o.pick ? " pick" : "");

        // 价格日志：显示最新价 + 查价日期，多于一条时列出历史和涨跌箭头
        const hist = o.prices || [];
        const cur = hist[hist.length - 1];
        let priceHTML = "", histHTML = "";
        if (cur){
          priceHTML = `<div class="pr">$${cur.price.toLocaleString()}<span class="on">@ ${cur.on}</span></div>`;
          if (hist.length > 1){
            histHTML = '<div class="hist">' + hist.map((p, i) => {
              let arr = "";
              if (i > 0) arr = p.price > hist[i-1].price ? '<span class="up">↑</span>'
                             : p.price < hist[i-1].price ? '<span class="down">↓</span>' : "→";
              return `${arr}${p.on} $${p.price.toLocaleString()}`;
            }).join('<span class="sep">·</span>') + "</div>";
          }
        }

        const timeHTML = (o.time || "")
          .replace(/\(\+(\d+)\)/, '<sup>+$1</sup>')
          .replace(/\s*[–-]\s*/, '<span class="tline"></span>');
        const code = o.code || (o.airline || "?").slice(0, 2).toUpperCase();
        card.innerHTML =
          `<div class="left">` +
            `<div class="av" style="background:${o.color || "#4a505a"}">${code}</div>` +
            `<div class="al">${[o.airline, o.flight].filter(Boolean).join(" · ")}` +
              `${o.note ? `<div class="nt">${o.note}</div>` : ""}</div>` +
          `</div>` +
          `<div class="mid">` +
            `<div class="tm">${timeHTML}</div>` +
            `<div class="chips">${(o.tags || []).map(t =>
              `<span class="chip${/nonstop|直飞/i.test(t) ? " dur" : ""}">${t}</span>`).join("")}` +
              `${o.pick ? `<span class="chip star">⭐ picked</span>` : ""}</div>` +
          `</div>` +
          `<div class="pricebox">${priceHTML}${histHTML}</div>`;
        grid.appendChild(card);
      });
    }
    sec.appendChild(grid);
    box.appendChild(sec);
  });
})();
