import { LLMClient } from "../llm/client";

const QUERY_PROMPT = `You are a knowledge base assistant. The user will ask a question. You have access to a wiki index and relevant wiki pages.

Read the provided wiki content carefully and answer the question. Be specific and thorough. If the wiki lacks sufficient information, say so clearly.

Citation format (academic style):
- In the body, mark citations as superscript numbers: [1], [2], etc.
- At the end of your answer, add a "## References" section listing each cited wiki page in order:
  [1] [[Page Title]]
  [2] [[Another Page]]
- Only list pages you actually cited. Do not use [[wikilinks]] inline in the body text.`;

export async function queryWiki(
  question: string,
  wikiContext: string,
  client: LLMClient,
  signal?: AbortSignal
): Promise<string> {
  const userMsg = `Wiki content:\n${wikiContext}\n\n---\n\nQuestion: ${question}`;
  return client.complete(QUERY_PROMPT, userMsg, signal);
}
