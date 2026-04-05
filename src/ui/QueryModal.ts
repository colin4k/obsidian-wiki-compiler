import { App, Modal, Setting, MarkdownRenderer, Component } from "obsidian";

export class QueryModal extends Modal {
  private question = "";
  private answer = "";
  private onQuery: (question: string) => Promise<string>;
  private onSave: (question: string, answer: string) => Promise<void>;
  private answerEl: HTMLElement | null = null;
  private saveBtn: HTMLButtonElement | null = null;
  private askBtn: HTMLButtonElement | null = null;

  constructor(
    app: App,
    onQuery: (question: string) => Promise<string>,
    onSave: (question: string, answer: string) => Promise<void>
  ) {
    super(app);
    this.onQuery = onQuery;
    this.onSave = onSave;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "Query Wiki" });

    new Setting(contentEl)
      .setName("Question")
      .addText((t) => {
        t.setPlaceholder("Ask anything about your wiki...").onChange((v) => (this.question = v));
        t.inputEl.style.width = "100%";
        t.inputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter") this.runQuery();
        });
      });

    new Setting(contentEl).addButton((b) => {
      b.setButtonText("Ask").setCta().onClick(() => this.runQuery());
      this.askBtn = b.buttonEl;
    });

    this.answerEl = contentEl.createDiv({ cls: "wiki-query-answer" });
    this.answerEl.style.cssText = "display:none;margin-top:12px;padding:12px;border:1px solid var(--background-modifier-border);border-radius:6px;max-height:400px;overflow-y:auto;";
    // Table border styles
    const style = this.answerEl.createEl("style");
    style.textContent = ".wiki-query-answer table{border-collapse:collapse;width:100%}.wiki-query-answer th,.wiki-query-answer td{border:1px solid var(--background-modifier-border);padding:4px 8px}";

    const saveRow = contentEl.createDiv();
    saveRow.style.cssText = "display:none;margin-top:8px;text-align:right;gap:8px;display:none;";
    const copyBtn = saveRow.createEl("button", { text: "Copy" });
    copyBtn.style.marginRight = "8px";
    copyBtn.addEventListener("click", () => navigator.clipboard.writeText(this.answer));
    this.saveBtn = saveRow.createEl("button", { text: "Save to Wiki" });
    this.saveBtn.addEventListener("click", async () => {
      await this.onSave(this.question, this.answer);
      saveRow.style.display = "none";
    });
    (this as any)._saveRow = saveRow;
  }

  private async runQuery() {
    if (!this.question.trim() || !this.answerEl) return;
    if (this.askBtn) this.askBtn.disabled = true;
    this.answerEl.style.display = "block";
    this.answerEl.setText("Searching wiki...");
    (this as any)._saveRow.style.display = "none";

    try {
      this.answer = await this.onQuery(this.question);
      this.answerEl.empty();
      await MarkdownRenderer.render(this.app, this.answer, this.answerEl, "", new Component());
      linkifyRefNumbers(this.answerEl);
      (this as any)._saveRow.style.display = "block";
    } catch (e) {
      this.answerEl.setText(`Error: ${(e as Error).message}`);
    } finally {
      if (this.askBtn) this.askBtn.disabled = false;
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

function linkifyRefNumbers(el: HTMLElement) {
  // Add id anchors to reference list items: [1] [[Title]] → <li id="ref-1">
  const refSection = Array.from(el.querySelectorAll("h2")).find(
    (h) => h.textContent?.trim().toLowerCase() === "references"
  );
  if (!refSection) return;

  const refList = refSection.nextElementSibling;
  if (!refList) return;

  refList.querySelectorAll("li").forEach((li) => {
    const match = li.textContent?.match(/^\[(\d+)\]/);
    if (match) li.id = `ref-${match[1]}`;
  });

  // Replace [N] in body text nodes with anchor links
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const replacements: { node: Text; parent: Node }[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (node.parentElement?.closest('[id^="ref-"]')) continue;
    if (/\[\d+\]/.test(node.textContent ?? "")) replacements.push({ node, parent: node.parentNode! });
  }

  for (const { node, parent } of replacements) {
    const frag = document.createDocumentFragment();
    node.textContent!.split(/(\[\d+\])/).forEach((part) => {
      const m = part.match(/^\[(\d+)\]$/);
      if (m) {
        const a = document.createElement("a");
        a.href = `#ref-${m[1]}`;
        a.textContent = part;
        a.style.cssText = "font-size:0.75em;vertical-align:super;text-decoration:none;";
        frag.appendChild(a);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    parent.replaceChild(frag, node);
  }
}
