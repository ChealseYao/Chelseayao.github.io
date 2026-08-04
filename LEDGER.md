# 📒 Ledger 记账本 · 数据格式与规则

> 给 Claude 的操作手册。工作流：**Chelsea 按月整理好账目表发给 Claude → Claude 按本文规则解析，
> 生成 `assets/data/ledger/2026-MM.json` 并把月份加进 `index.json` → 校验总额一致后等 Chelsea 说"发版"再推。**
> 渲染逻辑在 `assets/js/ledger.js`，更新数据时不动。新规则出现时先更新本文件。

## 数据文件结构

```
assets/data/ledger/
├── index.json      年份/期间/月份清单/分类配置（emoji + 颜色）
├── 2026-01.json    一月一个文件，交易数组 [{d,t,a,cat,n?}]
└── ...             d=月.日  t=商户  a=金额(退款为负)  cat=分类名  n=备注(可选)
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

## 分类（12 类）与固定颜色（已过深色面 CVD 校验）

| 分类 | 颜色 | 归一来源 / 规则 |
|---|---|---|
| 🥬 Groceries | #1fa06c 绿（用户指定） | Groceries；COSTCO/TARGET/WEEE/99 RANCH/TRADER JOE 强制归入 |
| 🍽️ Dine Out | #3987e5 蓝 | Food & Drink / DineOut；Total Wine、Duke Bakery、Habit、In-N-Out |
| 🛍️ Shopping | #d55181 粉（用户指定） | Shopping |
| 🚗 Car | #c98500 金 | Gas / Automotive / Car；COSTCO GAS、CHEVRON；**停车费（PARKING）也归这里**（Travel 已并入） |
| 🎬 Entertainment | #9085e9 紫（用户指定） | Entertainment |
| 🧾 Bills & Utilities | #cf4444 红 | Bills & Utilities |
| 🐶 Alice | #d3bd45 嫩黄（用户指定） | Personal / Alice（宠物） |
| 🏥 Health | #b5722e 棕 | Health & Wellness / Health |
| 🎁 Gifts | #2f9db5 青 | 礼物；REI+备注「尚可Birthday」、REI 始祖鸟小包 |
| ⏰ Subscription | #d95926 橙 | 订阅；**OPENAI 一律归这里，名字写 `OpenAI 🤖`** |
| 🥤 Food & Drink | #8c8f3a 橄榄黄 | **便利店/小吃/奶茶**（7-Eleven 等），新出现的按此归入 |
| 🏠 Home | #c2597d 玫瑰 | Home |

## 商户名规范（解析时处理，写进 JSON）

1. **去尾部店号**：`THE HOME DEPOT #6680` → `The Home Depot`
2. **剥支付通道前缀**：TST\* / SQ \* / SPO\* / UEP\* / NIC\* / FD \* / MCK - / TM \* / OCULUS \*码
3. **首字母大写为主**，保留品牌缩写（REI、AMC、H&M、AT&T、DMV、LA、GW、SFC、KP→Kaiser…）
4. **emoji 装饰与文字之间加空格**：`Target 🎯`、`Costco 🛒`、`H&M 👕`、`99 Ranch 🥬`、`Rooster & Rice 🐔🍚`；🍑 单独作淘宝名
5. 同一商户一个名字一个分类，录入后跑一致性体检
6. **同一天 + 同一商户 + 同一分类的多笔合并成一笔**（金额相加，退款也一并抵扣；带备注的不合并）
7. 特殊改名：AMC 9640 → `AMC Membership 🎬`；TM \*LA CLIPPERS → `CLIPPERS Game 🏀`；TCKTWEB\*ELECTRIKSEOUL → `SixFlags Ticket 🎢`；MISSION VIEJO CA-HCO → `Hollister`；SUPERIOR SUPER WHSE → `Superior Grocers`；CHAO WEI JU → `潮厢 🐮`；完整映射见解析脚本历史
8. 单笔特例：2.24 Costco $97.00 实为加油 → `Costco Gas ⛽️`（Car）

## 展示约定

- 页首大数字 = 当前范围总支出；**默认打开最新月份**；月份胶囊按 index.json 生成
- 汇总卡标题叫 **Category**；每分类固定专属色（见上表），切月不重排
- 流水标签为「色点 + 分类名」固定宽度列（对齐），非胶囊
- 环形图每分类一片、悬停看金额/占比、点切片或分类行筛选流水
- 流水全量显示（不分页）、日期降序、`月.日.年`、行尾彩色分类标签、退款绿色
- 每次录入必须核对：月度合计与总额 = 排除 Payment 后的表格合计
- 页面有密码门（gate.js），不要动 ledger.html 底部的 data-hash
