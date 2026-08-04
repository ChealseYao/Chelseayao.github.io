# chelseayao.github.io

Personal website and portfolio

## 文件结构

```
├── index.html              主页（Days Matter 倒数日 + 各模块入口）
├── 2026-china-trip.html    2026 回国行程页（已发布链接，留在根目录不动）
├── pages/                  子页面按模块分文件夹
│   ├── moments/alice.html      Alice 相册页
│   ├── travels/tijuana.html    旅行相册页
│   ├── travels/catalina.html
│   ├── plan/gifts.html         伴手礼清单页（从行程页 TODO 点进）
│   ├── plan/flights.html       机票清单页（从行程页 TODO 点进）
│   └── plan/wedding.html       答谢宴+领证 PLAN（主页 Plan 卡片 / 行程页"领证"点进）
├── photos/
│   ├── moments/
│   │   └── alice/          Alice 照片（命名：YYYYMMDD-序号.jpg）
│   └── travels/            每次旅行一个文件夹（命名：YYYYMM-地名）
│       ├── 202604-catalina/    照片命名：YYYYMMDD-序号-地点.jpg
│       └── 202607-tijuana/
└── assets/
    ├── css/
    │   ├── base.css        全站公共主题变量（配色 / 字体，改这里全站生效）
    │   ├── gallery.css     相册页共用样式（3:4 网格 + 灯箱）
    │   ├── flights.css     机票页共用样式（航班卡片模板）
    │   └── days.css        Days Matter 模块样式
    └── js/
        ├── days.js         倒数日数据 + 渲染逻辑（加倒数日改这里）
        ├── gifts.js        伴手礼清单数据 + 渲染逻辑（记伴手礼改这里）
        ├── wedding.js      答谢宴+领证 PLAN 清单（打勾改这里）
        ├── gallery.js      相册页共用渲染逻辑（网格 + 灯箱）
        ├── flight-card.js  机票卡片共用渲染模板（勿放数据）
        ├── flights/        每个行程一个机票数据文件（字段说明见文件头注释）
        │   └── 2026-china.js
        └── photos/         照片清单（scripts/sync-photos.js 自动生成，勿手改）
            ├── descriptions.js  ★ Moments 照片描述（key:value，唯一手动编辑的文件）
            ├── alice.js
            ├── tijuana.js
            └── catalina.js
```

## 加一个新相册（如新的旅行）

1. 建文件夹 `photos/travels/YYYYMM-<地名>/`，照片按 `YYYYMMDD-序号-地点.jpg` 放进去
   （不知道具体日子可用月份级：`YYYYMM-序号-地点.jpg`，卡片就不显示具体日期）
2. 跑 `node scripts/sync-photos.js`（或直接 push，GitHub Action 会自动跑）——
   照片清单和相册页（通用空壳模板）都会自动生成
3. 相册的 emoji / 标题 / 副标题：改 `assets/js/photos/<相册>.js` 顶部的 `meta` 行（同步永远保留这行）
4. 主页对应板块加一张卡片（这步手动，需要选 emoji 和颜色）
5. 照片配字（所有相册都支持）：编辑 `assets/js/photos/descriptions.js`，文字显示在图下方的文字条里

## 约定

- `index.html` 和已发布的 `2026-china-trip.html` 留根目录，其他页面进 `pages/<模块>/`
- 新页面的 `<head>` 里先引 `assets/css/base.css`（pages 下注意 `../../` 前缀），再写页面自己的样式
- CSS / JS 归 `assets/`，图片等内容文件按类型建根目录文件夹（如 `photos/`）
- `scripts/sync-photos.js` 负责照片清单自动化，`.github/workflows/sync-photos.yml` 在 push 后自动执行它
- 记账本的数据格式与规则记在 [LEDGER.md](LEDGER.md)：Chelsea 按月发表格 → Claude 按手册录入
