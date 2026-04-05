# Obsidian Wiki Compiler

> 灵感来源于 [Andrej Karpathy 的 LLM 知识库](https://x.com/karpathy/status/2039805659525644595) 理念。

使用 LLM 将 Obsidian 笔记编译成结构化、互相关联的 Wiki。选择一篇笔记或一个文件夹，插件自动生成带有双向 `[[wikilinks]]` 的百科式文章，并按主题自动分类存入子目录。还能自动提取高频概念，通过网络搜索生成专属概念页面，持续丰富你的知识库。

[English Documentation](README.md)

---

## 功能特性

- **一键编译** — 右键任意笔记或文件夹 → "Compile to Wiki"
- **递归处理子目录** — 自动处理所选文件夹下所有子目录中的 `.md` 文件
- **智能分类** — LLM 将文章归入你自定义的分类列表；无匹配时回退到最后一个分类
- **自定义分类** — 在设置中自定义分类列表，切换输出语言时自动更新默认分类
- **双向链接** — 新文章链接到已有文章，已有文章通过 LLM 增量更新相关内容
- **概念提取** — 自动提取跨文章的高频概念，通过 SearXNG 搜索权威信息，生成专属概念页面；所有页面生成完毕后统一注入双向链接
- **Wiki 问答** — 基于 Wiki 内容提问，LLM 以学术引用格式回答（正文标注 `[1][2]`，末尾列出参考文献）；点击序号跳转引用；支持一键复制答案或保存为笔记
- **Wiki 健康检查** — 检测矛盾内容、孤立页面、缺失概念和过时信息
- **源文件归档** — 处理完成的笔记移入 `raw/` 目录，避免重复处理
- **累积索引** — `_index.md` 跨会话合并所有文章，按分类层级组织
- **操作日志** — `_log.md` 记录所有操作（编译、问答、检查、概念提取）
- **进度界面** — 实时显示处理进度，支持取消操作
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
| API Key | API 密钥（Ollama 不需要） | — |
| Model | 模型名称 | gpt-4o |
| Output Folder | Wiki 文章保存目录 | `Wiki` |
| Output Language | auto / zh / en / ja | auto |
| Categories | 每行一个分类，最后一行为兜底分类 | （随语言自动设置） |
| Max Concurrent | 并发请求数（1–10） | 3 |
| SearXNG Base URL | SearXNG 实例地址，用于概念搜索增强 | — |
| SearXNG Token | SearXNG 认证 Token（可选） | — |

### 自定义第三方 API

将 **LLM Provider** 设为 "Custom"，然后配置：
- **Custom Endpoint URL** — 完整的请求端点 URL，例如 `https://api.deepseek.com/v1/chat/completions`
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

会递归处理所有子目录中的 `.md` 文件。

### Wiki 问答

命令面板：`Wiki Compiler: Query Wiki`

打开问答窗口，输入问题后 LLM 基于 Wiki 内容回答，采用学术引用格式——正文中标注 `[1]`、`[2]`，答案末尾的 **References** 区块按序号列出引用的 Wiki 页面。点击序号可跳转到对应引用。点击 **Copy** 复制原始答案到剪贴板，或点击 **Save to Wiki** 将问答保存为 `Wiki/Queries/` 下的笔记。

### 健康检查

命令面板：`Wiki Compiler: Lint Wiki (health check)`

生成 `_lint-report.md` 报告，包含：
- 页面间的矛盾信息
- 无入链的孤立页面
- 值得独立成页的缺失概念
- 过时或陈旧的内容

### 概念提取

命令面板：`Wiki Compiler: Extract Concepts (retry SearXNG)`

手动触发概念提取，需配置 SearXNG。插件识别跨文章高频概念，通过网络搜索权威信息，生成专属概念页面，并将 `[[wikilink]]` 注入回相关文章。

### 输出结构

```
Wiki/
├── Wiki/                      ← 按分类组织的生成文章
│   ├── 机器学习/
│   │   ├── Transformer.md
│   │   └── 神经网络.md
│   └── 金融/
│       └── IPO流程.md
├── Concepts/                  ← 自动生成的概念页面
│   ├── 注意力机制.md
│   └── 梯度下降.md
├── raw/                       ← 原始源笔记（已归档）
├── Queries/                   ← 保存的问答结果
├── _index.md                  ← 文章累积索引
├── _log.md                    ← 操作日志
└── _lint-report.md            ← 最近一次健康检查报告
```

每篇文章包含：
- Frontmatter：`source`、`category`、`generated`
- 带 `[[wikilinks]]` 的百科式正文
- `## See Also` 双向链接区块

---

## 工作原理

1. **生成** — 每篇源笔记发送给 LLM，生成包含标题、分类、正文和相关主题的结构化 Wiki 文章
2. **链接** — 在所有新文章间注入双向 `[[wikilinks]]`，并添加 `## See Also` 区块
3. **更新** — 通过 LLM 增量更新已有的相关 Wiki 文章，融入新知识
4. **归档** — 源笔记移入 `raw/` 目录，防止重复处理
5. **索引** — 更新 `_index.md`，按分类组织新条目
6. **增强** — 若配置了 SearXNG，提取高频概念并通过网络搜索生成专属概念页面

---

## License

MIT
