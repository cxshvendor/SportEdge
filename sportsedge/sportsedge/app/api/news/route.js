let cache = { headlines: [], fetchedAt: 0 };
export async function GET() {
  const now = Date.now();
  if (now - cache.fetchedAt < 60000 && cache.headlines.length) return Response.json({ headlines: cache.headlines });
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 800, messages: [{ role: "user", content: "Search for today's breaking sports news: NBA, NFL, MLB, NHL, MMA, soccer. Return ONLY a JSON array of 10 short headline strings (max 90 chars each). No markdown, no preamble." }], tools: [{ type: "web_search_20250305", name: "web_search" }] }),
    });
    const data = await res.json();
    const text = (data.content || []).map(b => b.type === "text" ? b.text : "").join("\n");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const headlines = JSON.parse(cleaned);
    cache = { headlines, fetchedAt: now };
    return Response.json({ headlines });
  } catch(e) { return Response.json({ headlines: cache.headlines || ["Could not load headlines."] }); }
}
