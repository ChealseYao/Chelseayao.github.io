# 📒 Ledger 记账本 · 数据格式与规则

> 给 Claude 的操作手册。工作流：**Chelsea 按月整理好账目表发给 Claude → Claude 按本文规则解析，
> 生成 `assets/data/ledger/2026-MM.json` 并把月份加进 `index.json` → 校验总额一致后等 Chelsea 说"发版"再推。**
> 渲染逻辑在 `assets/js/ledger.js`，更新数据时不动。新规则出现时先更新本文件。

## 数据文件结构

```
assets/data/ledger/
├── index.json      年份/期间/月份清单/分类配置（emoji + 颜色）/cards 卡片清单
├── merchants.json  录入字典：Chase 原始名 → 显示名 + 分类（新商户问过 Chelsea 后追加）
├── 2026-01.json    一月一个文件，交易数组 [{d,t,a,cat,n?,card?}]
└── ...             d=月.日  t=商户  a=金额(退款为负)  cat=分类名  n=备注(可选)
                    card=卡片 id(可选，不写=index.json cards 第一张，即 Chase Credit ····5355)
                    卡片在明细行里是独立一列（显示 cards[].label，如 "Chase 5355"），不做筛选切换
                    ⚠️ 2026-08-04 起 Chelsea 新发来的流水均为 Chase ····3299，
                    解析时每笔都要写 "card": "3299"（历史 5355 数据不动、不写 card）
```

## Chelsea 的表格格式（输入）

| 列 | 说明 |
|---|---|
| Post Date | 两种写法混用：`MM/DD/YYYY`，以及 **`YYYY-日-月`（日在前！）** |
| Description | 商户名（可能带 emoji 装饰） |
| Note | 备注，显示为商户旁灰色小字 |
| Category | 分类（有无 emoji 前缀都可能） |
| Type | `Sale`=消费 · `Return`=退款 · **`Payment`=还款，排除不计** |
| Amount | **￥ 符号实际是美元 $**；Sale 负、Return/Payment 正 |

## 分类（15 类）与固定颜色（前 12 类已过深色面 CVD 校验）

| 分类 | 颜色 | 归一来源 / 规则 |
|---|---|---|
| 🥬 Groceries | #1fa06c 绿（用户指定） | Groceries；COSTCO/TARGET/WEEE/99 RANCH/TRADER JOE 强制归入 |
| 🍽️ Dine Out | #b5722e 暖棕（2026-08-04 换色，原蓝 #3987e5） | Food & Drink / DineOut；Habit、In-N-Out（酒类 Total Wine / Hi Time Wine 已挪去 Food & Drink） |
| 🛍️ Shopping | #d55181 粉（用户指定） | Shopping |
| 🚗 Car | #c98500 金 | Gas / Automotive / Car；COSTCO GAS、CHEVRON；**停车费（PARKING）也归这里**（Travel 已并入） |
| 🎬 Entertainment | #9085e9 紫（用户指定） | Entertainment |
| 🧾 Bills & Utilities | #cf4444 红 | Bills & Utilities |
| 🐶 Alice | #d3bd45 嫩黄（用户指定） | Personal / Alice（宠物） |
| 🏥 Health | #a3c9e8 蓝白（2026-08-04 换色，原棕给了 Dine Out） | Health & Wellness / Health |
| 🎁 Gifts | #2f9db5 青 | 礼物/人情；REI+备注「尚可Birthday」、REI 始祖鸟小包、🎂 Paris Baguette（生日蛋糕类） |
| ⏰ Subscription | #d95926 橙 | 订阅；**OPENAI 一律归这里，名字写 `🤖 OpenAI`** |
| 🥤 Food & Drink | #8c8f3a 橄榄黄 | **便利店/小吃/奶茶/面包房**（7-Eleven、Duke Bakery 🥐 等），新出现的按此归入 |
| 🏠 Home | #c2597d 玫瑰 | Home |
| 📈 Investment | #7e93ad 灰蓝 | Robinhood 定投（2026-08-04 Chelsea 指定单独分类） |
| 💅 Beauty | #b968d6 兰紫 | Nails 美甲（2026-08-04 Chelsea 指定单独分类） |
| ✈️ Travel | #3987e5 亮蓝（Dine Out 换色空出来的） | 旅行住宿/机票（2026-08-04 重开；停车费仍归 Car）；🏠 MMS Airbnb |

## 商户名规范（解析时处理，写进 JSON）

1. **去尾部店号**：`THE HOME DEPOT #6680` → `🔧 HomeDepot`
2. **剥支付通道前缀**：TST\* / SQ \* / SPO\* / UEP\* / NIC\* / FD \* / MCK - / TM \* / OCULUS \*码
3. **首字母大写为主**，保留品牌缩写（REI、AMC、H&M、AT&T、DMV、LA、GW、SFC、KP→Kaiser…）
4. **emoji 装饰放在文字前面，中间空一格**（2026-08-04 起，原来在尾部）：`🎯 Target`、`🛒 Costco`、`👕 H&M`、`🥬 99 Ranch`、`🐔🍚 Rooster & Rice`；🍑 单独作淘宝名
5. 同一商户一个名字一个分类，录入后跑一致性体检
6. **同一天 + 同一商户 + 同一分类的多笔合并成一笔**（金额相加，退款也一并抵扣；带备注的不合并）；
   退款跨天也要抵进同商户最近一笔消费，全额退货则连原消费一起删掉，账本里不留负数行
7. **Bakery 类（DUSU BAKERY 等）都记作 `🥐 Duke Bakery`，一律归 Food & Drink**
8. 特殊改名：**AMC 一律（含 AMC Theatres Online 等）** → `🎬 AMC Membership`；TM \*LA CLIPPERS → `🏀 CLIPPERS Game`；TCKTWEB\*ELECTRIKSEOUL → `🎢 SixFlags Ticket`；MISSION VIEJO CA-HCO → `👕 Hollister`；SUPERIOR SUPER WHSE → `Superior Grocers`；CHAO WEI JU → `🐮 潮厢`；完整映射见解析脚本历史
9. 单笔特例：2.24 Costco $97.00 实为加油 → `⛽️ Costco Gas`（Car）

## Chase ····3299 流水（2026-08-04 起）

- 格式：`Mon D, YYYY  emoji 商户  $金额`，**没有分类列**，按 merchants.json 归类；负号 = 退款
- 每笔写 `"card": "3299"`
- **Zelle 一律不计入**（转账不算消费，merchants.json 里标 `exclude: true`）
- 固定归类：Apple/Cursor/Cursor Usage/Grammarly/OpenAI → Subscription；
  Robinhood → Investment；Nails → Beauty；TJX Payment（联名卡还款，实为购物）→ Shopping；
  Nintendo → Entertainment；Grocery → Groceries；🍑 → Shopping

## 展示约定

- 页首大数字 = 当前范围总支出；**默认打开最新月份**；月份胶囊按 index.json 生成
- 汇总卡标题叫 **Category**；每分类固定专属色（见上表），切月不重排
- 流水列顺序：日期 | 商户 | 分类 | 卡片 | 金额（灰色卡片列隔开两个彩色列）；
  分类标签为「emoji + 分类色文字」（无底色胶囊，Chelsea 嫌丑弃用），固定宽度列左对齐；卡片列显示 cards[].label
- 环形图每分类一片、悬停看金额/占比、点切片或分类行筛选流水
- 流水全量显示（不分页）、日期降序、`月.日.年`、行尾彩色分类标签、退款绿色
- 每次录入必须核对：月度合计与总额 = 排除 Payment 后的表格合计
- 页面有密码门（gate.js），不要动 ledger.html 底部的 data-hash
