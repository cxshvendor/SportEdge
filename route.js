import { askClaude, extractJson } from "../../../lib/claude";
import { supabaseAdmin } from "../../../lib/supabase";
export async function POST(req) {
  const { player, prop, userId } = await req.json();
  const text = await askClaude([{ role: "user", content: `Analyze this player prop with real current data via web search. Player: "${player}", Prop: "${prop}". Return ONLY JSON no markdown: {"player":"...","prop":"...","recommendation":"OVER|UNDER|PASS","confidence":0-100,"hitRateRecent":"e.g. 7/10 last 10","keyFactor":"one honest sentence","edgePercent":number}. Do not inflate confidence. PASS if coinflip.` }], { useWebSearch: true });
  const result = extractJson(text);
  if (userId && result) { try { const sb = supabaseAdmin(); await sb.from("activity_log").insert({ user_id: userId, type: "prop_analysis", input: { player, prop }, output: result }); } catch(e) {} }
  return Response.json(result || { error: "Could not parse — try again." });
}
