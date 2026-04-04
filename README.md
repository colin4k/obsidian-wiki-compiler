# Obsidian Wiki Compiler

> Inspired by [Andrej Karpathy's LLM Knowledge Bases](https://x.com/karpathy/status/2039805659525644595) concept.

Transform your Obsidian notes into a structured, interconnected Wiki using LLMs. Select a note or folder, and the plugin compiles encyclopedic articles with bidirectional `[[wikilinks]]`, auto-categorized into subdirectories.

[中文文档](README.zh-CN.md)

---

## Features

- **One-click compilation** — right-click any note or folder → "Compile to Wiki"
- **Smart categorization** — LLM assigns domain categories; reuses existing categories before creating new ones
- **Bidirectional wikilinks** — new articles link to existing ones, and existing articles get backlinks updated automatically
- **Processed file marking** — source notes renamed with `.wikied` suffix to avoid reprocessing
- **Cumulative index** — `_index.md` merges all articles across sessions, organized by category
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
| Max Concurrent | Parallel requests (1–10) | 3 |

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

### Output structure

```
Wiki/
├── _index.md              ← cumulative index of all articles
├── Technology/
│   ├── Machine Learning.md
│   └── Neural Networks.md
└── Finance/
    └── IPO Process.md
```

Each article includes:
- Frontmatter: `source`, `category`, `generated`
- Encyclopedic content with `[[wikilinks]]`
- `## See Also` section with bidirectional links

### Processed notes

After compilation, source notes are renamed:
```
My Note.md  →  My Note.wikied.md
```
Folder processing automatically skips `.wikied.md` files.

---

## License

MIT
