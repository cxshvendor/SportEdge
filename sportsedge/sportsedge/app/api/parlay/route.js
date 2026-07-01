import { askClaude, extractJson } from "../../../lib/claude";
import { supabaseAdmin } from "../../../lib/supabase";
export async function POST(req) {
  const { sport, legs, risk, userId } = await req.json();
  const text = await askClaude([{ role: "user", content: `Build a ${legs}-leg ${sport} parlay for tonight's real games via web search. Risk: ${risk}. Return ONLY JSON no markdown: {"legs":[{"player":"...","team":"...","prop":"...","odds":"e.g. -135","rationale":"one honest sentence"}],"combinedOdds":"e.g. +465","overallConfidence":0-100}. Fewer legs over fake data. Be honest about combined probability.` }], { useWebSearch: true });
  const result = extractJson(text);
  if (userId && result) { try { const sb = supabaseAdmin(); await sb.from("activity_log").insert({ user_id: userId, type: "parlay", input: { sport, legs, risk }, output: result }); } catch(e) {} }
  return Response.json(result || { error: "Could not parse — try again." });
}
