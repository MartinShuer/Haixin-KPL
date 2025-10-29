# Haixin-KPL

这是一个静态前端项目，包含 `index.html`, `lottery.html`, `submit.html`，以及 `css/`, `js/`, `image/` 等静态资源。

## 本地提交状态
项目已被初始化为一个本地 git 仓库并完成初始提交（如果你运行了我接下来的命令）。

## 将本地仓库推送到 GitHub（两种方式）

方式 A — 你已在 GitHub 上创建空仓库：
1. 在 GitHub 网站创建一个新的空仓库（不要勾选初始化 README）。
2. 在本地项目目录运行：

```powershell
cd /d d:\VScode\Haixin-KPL
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

方式 B — 使用 GitHub CLI 自动创建并推送（需先安装并登录 gh）：

```powershell
cd /d d:\VScode\Haixin-KPL
gh repo create 你的用户名/仓库名 --public --source=. --remote=origin --push
```

## 启用 GitHub Pages（把站点托管为静态页面）
- 在仓库 Settings -> Pages 中选择分支（通常 `main`），保存即可。
- 或使用 `gh`：

```powershell
gh api -X POST repos/你的用户名/仓库名/pages -f source=main
```

---
如果你愿意，我可以：
- 继续把仓库推到 GitHub（请提供仓库 URL 或允许我用 `gh`）。
- 或我把准备好的本地提交交给你操作。