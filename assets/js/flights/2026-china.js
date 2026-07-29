// 2026 回国行程 —— 机票候选数据（配合 flight-card.js 渲染模板使用）
//
// 数据格式（模板约定，所有行程通用）：
// FLIGHT_GROUPS = [ 航段, ... ]
//   航段: { route:"LAX → 🇯🇵 Tokyo", date:"航段说明", options:[ 航班, ... ] }
//   航班: {
//     airline:"航司名", code:"两字码(圆徽章)", color:"#徽章色",
//     dep:"起飞时间", depAp:"起飞机场", arr:"落地时间", arrAp:"落地机场",
//     plus:"+2"(跨天,可省), dur:"12h 20m", stop:"Nonstop"(绿色标签,可省),
//     note:"日期等备注", link:"Google Flights 链接(标题可点,可省)",
//     fares:[ 票档, ... ]   // 一档一行
//   }
//   票档: { name:"档名", perks:"权益说明", prices:[{on:"月.日",price:数字},...], pick:false }
//   查价:往 prices 尾部加一条 { on, price }，自动显示涨跌趋势
//   选定:把那一档 pick 改成 true（高亮 ⭐，航段计入 picked）
const FLIGHT_GROUPS = [
  {
    route: "LAX → 🇯🇵 Tokyo",
    date: "12.4 – 12.6 · 跨日界线",
    options: [
      {
        airline:"American Airlines", code:"AA", color:"#3b6fb5",
        dep:"23:45", depAp:"LAX", arr:"05:05", arrAp:"HND", plus:"+2",
        dur:"12h 20m", stop:"Nonstop",
        note:"12.4.2026 Friday",
        link:"https://www.google.com/travel/flights/s/7nD6XUVbQuwUgTb69",
        fares:[
          { name:"Basic Plus Bag", perks:"❌ 不可改签 · 💺 选座付费 · 🧳 免费托运 ×1（第二件 $100 · 第三件 $200）",
            prices:[{ on:"7.28", price:1119 }], pick:false },
          { name:"主舱（经济舱）",  perks:"✅ 免费改签 · 💺 免费选座 · 🧳 免费托运 ×1（第二件 $100 · 第三件 $200）",
            prices:[{ on:"7.29", price:1239 }], pick:false },
          { name:"Main Plus",      perks:"✅ 免费改签 · 💺 免费选座+加腿距 · 🧳 免费托运 ×2", prices:[{ on:"7.29", price:1379 }], pick:false },
          { name:"豪华经济舱",      perks:"✅ 免费改签 · 💺 免费选座+加腿距 · 🛫 优先登机 · 🧳 免费托运 ×2", prices:[{ on:"7.29", price:1689 }], pick:false },
        ],
      },
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
