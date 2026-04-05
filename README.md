# Obsidian Wiki Compiler

> Inspired by [Andrej Karpathy's LLM Knowledge Bases](https://x.com/karpathy/status/2039805659525644595) concept.

Transform your Obsidian notes into a structured, interconnected Wiki using LLMs. Select a note or folder, and the plugin compiles encyclopedic articles with bidirectional `[[wikilinks]]`, auto-categorized into subdirectories. It also extracts key concepts via web search and enriches your knowledge base automatically.

[中文文档](README.zh-CN.md)

---

## Features

- **One-click compilation** — right-click any note or folder → "Compile to Wiki"
- **Recursive folder processing** — processes all `.md` files in subdirectories
- **Smart categorization** — LLM assigns articles to your custom category list; falls back to the last entry if no match
- **Customizable categories** — define your own category list in Settings; auto-updates when you switch output language
- **Bidirectional wikilinks** — new articles link to existing ones, and existing articles are incrementally updated with relevant new knowledge
- **Concept extraction** — automatically extracts high-frequency concepts across articles, enriches them via SearXNG web search, generates dedicated concept pages, and injects bidirectional links after all pages are created
- **Wiki query** — ask questions about your wiki and get answers with academic-style numbered citations `[1][2]`; click citation numbers to jump to references; copy answer to clipboard; results saved as query notes
- **Wiki lint** — health check that finds contradictions, orphan pages, missing concepts, and stale content
- **Source archival** — processed notes are moved to `raw/` folder to avoid reprocessing
- **Cumulative index** — `_index.md` merges all articles across sessions, organized by category
- **Activity log** — `_log.md` tracks all operations (ingest, query, lint, concept extraction)
- **Progress UI** — real-time progress modal with cancel support
- **Multi-provider LLM support** — OpenAI, Anthropic (Claude), Ollama (local), or any custom third-party API

---

## Installation

### Manual (recommended until plugin is in community store)

1. Download the [latest release](https://github.com/colin4k/obsidian-wiki-compiler/releases) (`main.js`, `manifest.json`, `styles.css`)
2. Copy the three files to your vault:
   ```
   <your-vault>/.obsidian/plugins/wiki-compiler/
   ```
3. In Obsidian: **Settings → Community Plugins → Enable** "Wiki Compiler"

### Build from source

```bash
git clone https://github.com/colin4k/obsidian-wiki-compiler.git
cd obsidian-wiki-compiler
npm install
npm run build
# Copy main.js + manifest.json + styles.css to your vault's plugin folder
```

---

## Configuration

Open **Settings → Wiki Compiler**:

| Setting | Description | Default |
|---------|-------------|---------|
| LLM Provider | OpenAI / Anthropic / Ollama / Custom | OpenAI |
| API Key | Your API key (not needed for Ollama) | — |
| Model | Model name | gpt-4o |
| Output Folder | Where Wiki articles are saved | `Wiki` |
| Output Language | auto / zh / en / ja | auto |
| Categories | One per line; last entry is the fallback | (language defaults) |
| Max Concurrent | Parallel requests (1–10) | 3 |
| SearXNG Base URL | URL of your SearXNG instance for concept enrichment | — |
| SearXNG Token | Optional Bearer token for authenticated SearXNG | — |

### Custom (third-party) provider

Set **LLM Provider** to "Custom", then configure:
- **Custom Endpoint URL** — full endpoint URL, e.g. `https://api.deepseek.com/v1/chat/completions`
- **API Compatibility** — OpenAI-compatible or Anthropic-compatible
- **API Key** and **Model**

---

## Usage

### Process a single note

Right-click any `.md` file in the file explorer → **Compile to Wiki**

Or use the command palette: `Wiki Compiler: Process current file`

### Process a folder

Right-click any folder → **Compile folder to Wiki**

Or use the command palette: `Wiki Compiler: Process folder (enter path)`

All `.md` files in subdirectories are included recursively.

### Query your Wiki

Command palette: `Wiki Compiler: Query Wiki`

A modal opens where you can ask questions. The LLM answers based on your wiki content with academic-style numbered citations — `[1]`, `[2]` in the body, with a **References** section at the end listing the cited wiki pages. Click any citation number to jump to its reference. Click **Copy** to copy the raw answer to clipboard, or **Save to Wiki** to persist the Q&A as a note in `Wiki/Queries/`.

### Lint (health check)

Command palette: `Wiki Compiler: Lint Wiki (health check)`

Generates `_lint-report.md` covering:
- Contradictions between pages
- Orphan pages with no incoming links
- Missing concepts that deserve their own page
- Stale or outdated content

### Extract concepts

Command palette: `Wiki Compiler: Extract Concepts (retry SearXNG)`

Manually triggers concept extraction. Requires SearXNG to be configured. The plugin identifies high-frequency concepts across articles, searches the web for authoritative information, and generates dedicated concept pages with `[[wikilinks]]` injected back into related articles.

### Output structure

```
Wiki/
├── Wiki/                      ← generated articles by category
│   ├── Machine Learning/
│   │   ├── Transformer.md
│   │   └── Neural Networks.md
│   └── Finance/
│       └── IPO Process.md
├── Concepts/                  ← auto-generated concept pages
│   ├── Attention Mechanism.md
│   └── Gradient Descent.md
├── raw/                       ← original source notes (archived)
├── Queries/                   ← saved query results
├── _index.md                  ← cumulative article index
├── _log.md                    ← activity log
└── _lint-report.md            ← latest lint report
```

Each article includes:
- Frontmatter: `source`, `category`, `generated`
- Encyclopedic content with `[[wikilinks]]`
- `## See Also` section with bidirectional links

---

## How it works

1. **Generate** — Each source note is sent to the LLM, which produces a structured wiki article with title, category, content, and related topics
2. **Link** — Bidirectional `[[wikilinks]]` are injected across all new articles, and a `## See Also` section is added
3. **Update** — Existing wiki articles mentioned in related topics are incrementally updated via LLM to incorporate new knowledge
4. **Archive** — Source notes are moved to `raw/` to prevent reprocessing
5. **Index** — `_index.md` is updated with new entries, organized by category
6. **Enrich** — If SearXNG is configured, high-frequency concepts are extracted, searched on the web, and turned into dedicated concept pages

---

## License

MIT
