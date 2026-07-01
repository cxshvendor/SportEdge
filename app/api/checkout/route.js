import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabase";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRICES = { weekly: process.env.STRIPE_PRICE_WEEKLY, monthly: process.env.STRIPE_PRICE_MONTHLY, annual: process.env.STRIPE_PRICE_ANNUAL };
export async function POST(req) {
  const { tier, userId, email } = await req.json();
  const priceId = PRICES[tier];
  if (!priceId) return Response.json({ error: "Invalid tier" }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: profile } = await sb.from("profiles").select("stripe_customer_id").eq("id", userId).single();
  let customerId = profile?.stripe_customer_id;
  if (!customerId) { const c = await stripe.customers.create({ email, metadata: { userId } }); customerId = c.id; await sb.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId); }
  const session = await stripe.checkout.sessions.create({
    customer: customerId, mode: "subscription", payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { ...(tier !== "weekly" ? { trial_period_days: 3 } : {}), metadata: { userId, tier } },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    metadata: { userId, tier },
  });
  return Response.json({ url: session.url });
}
