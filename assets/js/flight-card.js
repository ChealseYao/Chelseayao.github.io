// 机票卡片渲染模板（全站通用，勿放数据）
// 页面用法：先引入某个行程的数据文件（assets/js/flights/*.js，定义 FLIGHT_GROUPS），
// 再引入本文件；页面需有 <div id="flights"> 和 <b id="progress">，样式在 assets/css/flights.css
(function(){
  const box = document.getElementById("flights");
  if (!box || typeof FLIGHT_GROUPS === "undefined") return;

  // 价格日志 → 最新价 + 历史涨跌
  function priceBlock(prices){
    const hist = prices || [];
    const cur = hist[hist.length - 1];
    if (!cur) return "";
    let html = `<div class="pr">$${cur.price.toLocaleString()}<span class="on">@ ${cur.on}</span></div>`;
    if (hist.length > 1){
      html += '<div class="hist">' + hist.map((p, i) => {
        let arr = "";
        if (i > 0) arr = p.price > hist[i-1].price ? '<span class="up">↑</span>'
                       : p.price < hist[i-1].price ? '<span class="down">↓</span>' : "→";
        return `${arr}${p.on} $${p.price.toLocaleString()}`;
      }).join('<span class="sep">·</span>') + "</div>";
    }
    return html;
  }

  const progress = document.getElementById("progress");
  if (progress){
    const n = FLIGHT_GROUPS.length;
    progress.textContent = `${n} flight${n === 1 ? "" : "s"}`;
  }

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

        // 时间条：结构化字段（dep/arr/机场/时长）优先，否则退回 time 字符串
        let timeHTML;
        if (o.dep){
          timeHTML =
            `<div class="tpt"><b>${o.dep}</b><span class="ap">${o.depAp || ""}</span></div>` +
            `<div class="tmid"><div class="trow"><span class="tline"></span><span class="tdur">${o.dur || ""}</span><span class="tline"></span></div></div>` +
            `<div class="tpt right"><b>${o.arr}${o.plus ? `<sup>${o.plus}</sup>` : ""}</b><span class="ap">${o.arrAp || ""}</span></div>`;
        } else {
          timeHTML = (o.time || "")
            .replace(/\(\+(\d+)\)/, '<sup>+$1</sup>')
            .replace(/\s*[–-]\s*/, '<span class="tline"></span>');
        }
        const code = o.code || (o.airline || "?").slice(0, 2).toUpperCase();

        const topHTML =
          `<div class="top">` +
            `<div class="left">` +
              `<div class="av" style="background:${o.color || "#4a505a"}">${code}</div>` +
              `<div class="al">${o.link
                ? `<a class="alink" href="${o.link}" target="_blank">${[o.airline, o.flight].filter(Boolean).join(" · ")} <span class="ext">↗</span></a>`
                : [o.airline, o.flight].filter(Boolean).join(" · ")}` +
                `${o.note ? `<div class="nt">${o.note}</div>` : ""}</div>` +
            `</div>` +
            `<div class="mid">` +
              `<div class="tm">${timeHTML}</div>` +
              `${(o.tags || []).length || o.stop || o.pick ? `<div class="chips">` +
                `${o.stop ? `<span class="chip dur">${o.stop}</span>` : ""}` +
                `${(o.tags || []).map(t =>
                `<span class="chip${/nonstop|直飞/i.test(t) ? " dur" : ""}">${t}</span>`).join("")}` +
                `${o.pick ? `<span class="chip star">⭐ picked</span>` : ""}</div>` : ""}` +
            `</div>` +
            (o.prices ? `<div class="pricebox">${priceBlock(o.prices)}</div>` : "") +
          `</div>`;

        // perks 按「 · 」+emoji 拆成不可断行的小块：窄屏时整项换行，不从中间断开
        const perksHTML = f_perks => (f_perks || "")
          .split(/ · (?=\p{Extended_Pictographic})/u)
          .map(p => `<span class="pk">${p}</span>`)
          .join('<span class="psep"> · </span>');

        const faresHTML = o.fares ? `<div class="fares">` + o.fares.map(f =>
          `<div class="fare${f.pick ? " pick" : ""}">` +
            `<span class="fname">${f.pick ? "⭐ " : ""}${f.name}</span>` +
            `<span class="fperks">${perksHTML(f.perks)}${f.fee ? `<span class="ffee">${f.fee}</span>` : ""}</span>` +
            `<div class="fprice">${priceBlock(f.prices)}</div>` +
          `</div>`
        ).join("") + `</div>` : "";

        card.innerHTML = topHTML + faresHTML +
          (o.foot ? `<div class="foot">${o.foot}</div>` : "");
        grid.appendChild(card);
      });
    }
    sec.appendChild(grid);
    box.appendChild(sec);
  });
})();
