# AI 合同录入助手 · 交互原型 Demo

Vite + React 演示项目：AI 对话驱动上传识别、双表确认、草稿预览与提交检查（均为 mock）。

## 本地运行

```bash
npm install
npm run dev
```

## 主要入口

| 路径 | 说明 |
|------|------|
| `/demo` | 可运行 Demo 流程 |
| `/prototype` | 可点击原型 + Annotation Mode |
| `/screen-map` | 流程地图（flowSpec） |
| `/design-export` | 导出 JSON / CSV / Mermaid / Markdown |

流程数据单一来源：`src/flowSpec.js`。

## 换电脑 / 团队协作

见 **[GITHUB_SETUP.md](./GITHUB_SETUP.md)**：首次推 GitHub、另一台 clone、日常 `pull` / `push`。

## 部署到公网（可选）

```bash
npm run build
```

将 `dist` 部署到 Vercel / Netlify；已包含 SPA 路由配置（`vercel.json`、`public/_redirects`）。
