export async function askClaude(messages, { useWebSearch = true, system = "" } = {}) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages,
  };
  if (system) body.system = system;
  if (useWebSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("\n");
}

export function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(cleaned); } catch {
    const first = cleaned.search(/[\[{]/);
    const last = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
    if (first !== -1 && last !== -1) {
      try { return JSON.parse(cleaned.slice(first, last + 1)); } catch { return null; }
    }
    return null;
  }
}
