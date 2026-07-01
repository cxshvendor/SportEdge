import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabase";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET); } catch(e) { return Response.json({ error: e.message }, { status: 400 }); }
  const sb = supabaseAdmin();
  const t = event.type;
  if (t === "checkout.session.completed") {
    const s = event.data.object; const { userId, tier } = s.metadata || {};
    if (userId) { await sb.from("profiles").update({ subscription_status: "trialing", subscription_tier: tier }).eq("id", userId); await sb.from("orders").insert({ user_id: userId, email: s.customer_details?.email, stripe_event_id: event.id, stripe_subscription_id: s.subscription, tier, amount_cents: s.amount_total, status: "trial_started" }); }
  } else if (t === "customer.subscription.updated") {
    const s = event.data.object; const { userId, tier } = s.metadata || {};
    if (userId) { await sb.from("profiles").update({ subscription_status: s.status, trial_ends_at: s.trial_end ? new Date(s.trial_end * 1000).toISOString() : null }).eq("id", userId); await sb.from("orders").insert({ user_id: userId, stripe_event_id: event.id, stripe_subscription_id: s.id, tier, status: s.status }); }
  } else if (t === "customer.subscription.deleted") {
    const s = event.data.object; const { userId } = s.metadata || {};
    if (userId) { await sb.from("profiles").update({ subscription_status: "canceled" }).eq("id", userId); await sb.from("orders").insert({ user_id: userId, stripe_event_id: event.id, status: "canceled" }); }
  } else if (t === "invoice.payment_failed") {
    const inv = event.data.object; await sb.from("orders").insert({ email: inv.customer_email, stripe_event_id: event.id, status: "payment_failed", amount_cents: inv.amount_due });
  }
  return Response.json({ received: true });
}
