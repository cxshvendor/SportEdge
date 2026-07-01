import { supabaseAdmin } from "../../../lib/supabase";
const ADMINS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (!ADMINS.includes((searchParams.get("email") || "").toLowerCase())) return Response.json({ error: "Not authorized" }, { status: 403 });
  const sb = supabaseAdmin();
  const { data: profiles } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  const { data: orders } = await sb.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
  const activeSubs = profiles?.filter(p => ["active","trialing"].includes(p.subscription_status)).length || 0;
  const revenue = orders?.filter(o => o.status === "active").reduce((s, o) => s + (o.amount_cents || 0), 0) || 0;
  return Response.json({ profiles, orders, stats: { totalUsers: profiles?.length || 0, activeSubs, revenueCents: revenue } });
}
