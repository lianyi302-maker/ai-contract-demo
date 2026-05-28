# 首次推送到 GitHub · 在另一台电脑继续用 Cursor 编辑

本仓库是 **Vite + React** 前端 Demo，用 Git 同步代码即可在任意电脑的 Cursor 里继续开发。

---

## 一、这台电脑：第一次上传

### 1. 安装 Git（若还没有）

- macOS：终端执行 `git --version`，没有则安装 [Xcode Command Line Tools](https://developer.apple.com/xcode/) 或 [Git 官网](https://git-scm.com/)
- Windows：安装 [Git for Windows](https://git-scm.com/download/win)

### 2. 在 GitHub 创建空仓库

1. 登录 [github.com](https://github.com)
2. 右上角 **+** → **New repository**
3. 仓库名示例：`contract-prototype`（随意）
4. 选 **Private**（仅自己可见）或 **Public**
5. **不要**勾选 “Add a README” / “Add .gitignore”（本地已有）
6. 创建后记下仓库地址，形如：  
   `https://github.com/你的用户名/contract-prototype.git`

### 3. 在本项目目录执行

```bash
cd /Users/lianyi-gd/Documents/cursor1

# 初始化仓库（只需做一次）
git init

# 查看将要提交的文件（不应出现 node_modules、dist）
git status

# 首次提交
git add .
git commit -m "Initial commit: AI 合同录入助手 Demo"

# 关联远程（把下面地址换成你的仓库）
git remote add origin https://github.com/你的用户名/contract-prototype.git

# 主分支命名为 main 并推送
git branch -M main
git push -u origin main
```

首次 `git push` 会要求登录 GitHub：

- 推荐：**Personal Access Token** 作为密码（Settings → Developer settings → Tokens）
- 或使用 **GitHub CLI**：`gh auth login`

---

## 二、另一台电脑：用 Cursor 打开并开发

### 1. 安装环境

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)（建议 LTS，如 20.x）
- [Cursor](https://cursor.com/)

### 2. 克隆仓库

```bash
cd ~/Documents   # 或你习惯的目录
git clone https://github.com/你的用户名/contract-prototype.git
cd contract-prototype
npm install
npm run dev
```

浏览器打开终端里的地址（一般为 `http://localhost:5173`）。

### 3. 用 Cursor 打开项目

**File → Open Folder** → 选择刚 clone 的 `contract-prototype` 文件夹。

---

## 三、两台电脑之间同步改动（日常流程）

**在任意一台改完代码后：**

```bash
git add .
git commit -m "简要说明本次修改"
git push
```

**在另一台拉取最新代码：**

```bash
git pull
npm install    # 仅当 package.json 有变化时需要
```

> 若 `git pull` 提示冲突，先不要强行覆盖；在 Cursor 里打开冲突文件，保留正确内容后再 `git add` → `git commit`。

---

## 四、`.gitignore` 已忽略的内容（不要提交）

| 路径 | 原因 |
|------|------|
| `node_modules/` | 依赖太大，另一台执行 `npm install` 即可 |
| `dist/` | 构建产物，可随时 `npm run build` 生成 |
| `.env` / `.env.*` | 可能含密钥 |
| `.DS_Store` 等 | 系统/编辑器垃圾文件 |

参考截图等资源在 `public/references/`，**会随仓库一起同步**（体积不大）。

---

## 五、常用页面路径（本地或部署后）

| 功能 | 路径 |
|------|------|
| AI Demo | `/demo` |
| Prototype + 标注 | `/prototype` |
| Screen Map | `/screen-map` |
| Design Export | `/design-export` |

部署到 Vercel/Netlify 见项目根目录 `vercel.json`、`public/_redirects`。

---

## 六、Cursor 相关说明

- **项目代码**：靠 Git 同步，Cursor 不会自动跨设备传文件夹。
- **对话记录**：默认不跟仓库走；重要结论可记在 issue、README 或 `flowSpec.js` 注释里。
- **编辑器设置**：可在 Cursor 里开启 **Settings Sync**（只同步偏好，不同步源码）。

---

## 七、出问题时

| 现象 | 处理 |
|------|------|
| `git push` 被拒绝 | 先 `git pull --rebase` 再 `git push` |
| 另一台 `npm run dev` 报错 | 删除 `node_modules` 后重新 `npm install` |
| 页面空白 | 确认已 `npm run dev`，浏览器硬刷新 |
| 忘记 GitHub 地址 | 仓库页 **Code** 按钮复制 HTTPS 地址 |

---

## 八、检查清单（推送前）

- [ ] 已执行 `git status`，确认没有 `node_modules`、`dist`
- [ ] 没有 `.env` 含真实密钥
- [ ] 本地 `npm run build` 能通过
- [ ] 已在 GitHub 创建空仓库并 `git remote add origin ...`

完成以上步骤后，即可在任意电脑的 Cursor 中继续编辑本项目。
