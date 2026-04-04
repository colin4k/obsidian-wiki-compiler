# Obsidian Wiki Compiler

> 灵感来源于 [Andrej Karpathy 的 LLM 知识库](https://x.com/karpathy/status/2039805659525644595) 理念。

使用 LLM 将 Obsidian 笔记编译成结构化、互相关联的 Wiki。选择一篇笔记或一个文件夹，插件自动生成带有双向 `[[wikilinks]]` 的百科式文章，并按主题自动分类存入子目录。

[English Documentation](README.md)

---

## 功能特性

- **一键编译** — 右键任意笔记或文件夹 → "Compile to Wiki"
- **智能分类** — LLM 自动分配领域分类，优先复用已有分类目录
- **双向链接** — 新文章链接到已有文章，已有文章的 See Also 自动更新反向链接
- **处理标记** — 源笔记重命名为 `.wikied.md` 后缀，避免重复处理
- **累积索引** — `_index.md` 跨会话合并所有文章，按分类层级组织
- **多 LLM 支持** — OpenAI、Anthropic (Claude)、Ollama（本地）或任意第三方 API

---

## 安装

### 手动安装（推荐，在上架社区插件市场前）

1. 从 [最新 Release](https://github.com/colin4k/obsidian-wiki-compiler/releases) 下载 `main.js`、`manifest.json`、`styles.css`
2. 将三个文件复制到 vault 目录：
   ```
   <你的vault>/.obsidian/plugins/wiki-compiler/
   ```
3. 在 Obsidian 中：**设置 → 第三方插件 → 启用** "Wiki Compiler"

### 从源码构建

```bash
git clone https://github.com/colin4k/obsidian-wiki-compiler.git
cd obsidian-wiki-compiler
npm install
npm run build
# 将 main.js + manifest.json + styles.css 复制到 vault 插件目录
```

---

## 配置

打开 **设置 → Wiki Compiler**：

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| LLM Provider | OpenAI / Anthropic / Ollama / 自定义 | OpenAI |
| API Key | 你的 API 密钥（Ollama 不需要） | — |
| Model | 模型名称 | gpt-4o |
| Output Folder | Wiki 文章保存目录 | `Wiki` |
| Output Language | auto / zh / en / ja | auto |
| Max Concurrent | 并发请求数（1–10） | 3 |

### 自定义第三方 API

将 **LLM Provider** 设为 "Custom"，然后配置：
- **Custom Endpoint URL** — 完整的请求端点 URL，例如 `https://api.minimaxi.com/anthropic/v1/messages`
- **API Compatibility** — OpenAI 兼容或 Anthropic 兼容
- **API Key** 和 **Model**

---

## 使用方法

### 处理单篇笔记

在文件浏览器中右键任意 `.md` 文件 → **Compile to Wiki**

或使用命令面板：`Wiki Compiler: Process current file`

### 处理文件夹

右键任意文件夹 → **Compile folder to Wiki**

或使用命令面板：`Wiki Compiler: Process folder (enter path)`

### 输出结构

```
Wiki/
├── _index.md              ← 所有文章的累积索引
├── 科技/
│   ├── 机器学习.md
│   └── 神经网络.md
└── 金融/
    └── IPO流程.md
```

每篇文章包含：
- Frontmatter：`source`、`category`、`generated`
- 带 `[[wikilinks]]` 的百科式正文
- `## See Also` 双向链接区块

### 处理标记

编译完成后，源笔记自动重命名：
```
我的笔记.md  →  我的笔记.wikied.md
```
对文件夹处理时，`.wikied.md` 文件会自动跳过。

---

## License

MIT
