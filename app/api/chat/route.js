import { askClaude } from "../../../lib/claude";
import { supabaseAdmin } from "../../../lib/supabase";
export async function POST(req) {
  const { messages, userId } = await req.json();
  const reply = await askClaude(messages, { useWebSearch: true, system: "You are a sharp, honest sports research assistant. Use web search for current stats, injuries, odds, news — never guess. State confidence as a percentage. Be honest about uncertainty. Keep under 120 words unless asked for more. This is informational research, not betting advice." });
  if (userId) { try { const sb = supabaseAdmin(); await sb.from("activity_log").insert({ user_id: userId, type: "chat", input: { messages }, output: { reply } }); } catch(e) {} }
  return Response.json({ reply });
}
