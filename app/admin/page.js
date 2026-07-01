"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase";
import "../globals.css";

export default function Admin() {
  const router = useRouter(); const sb = supabaseBrowser();
  const [user, setUser] = useState(null); const [data, setData] = useState(null); const [tab, setTab] = useState("users"); const [denied, setDenied] = useState(false);

  const load = async (email) => {
    const r = await fetch(`/api/admin-data?email=${encodeURIComponent(email)}`);
    if (r.status === 403) { setDenied(true); return; }
    setData(await r.json());
  };

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) return router.push("/login");
      setUser(data.user); load(data.user.email);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => load(user.email), 10000);
    return () => clearInterval(id);
  }, [user]);

  if (denied) return <div className="page" style={{ color: "#FF4757" }}>Not authorized. Your email must be in ADMIN_EMAILS env var.</div>;
  if (!data) return <div className="page" style={{ color: "#6B7685" }}>Loading admin data…</div>;

  const statusColor = { active: "#00D87A", trialing: "#2B9DFF", canceled: "#FF4757", past_due: "#F2A900", trial_started: "#2B9DFF", payment_failed: "#FF4757", none: "#6B7685" };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24, minHeight: "100vh", background: "#0B0E14", color: "#E8ECF1", fontFamily: "Inter,sans-serif" }}>
      <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 26, marginBottom: 20 }}>
        SPORTS<span style={{ color: "#2B9DFF" }}>EDGE</span> <span style={{ fontWeight: 500, color: "#6B7685" }}>Admin</span>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[["Total Users", data.stats.totalUsers], ["Active Subs", data.stats.activeSubs], ["Revenue", `$${(data.stats.revenueCents / 100).toFixed(2)}`]].map(([l, v]) => (
          <div key={l} style={{ flex: 1, background: "#131822", border: "1px solid #1F2630", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#6B7685", marginBottom: 4 }}>{l}</div>
            <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 28 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {["users","orders"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1B2230" : "#131822", border: "1px solid #1F2630", color: tab === t ? "#2B9DFF" : "#9AA4B2", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
            {t === "users" ? `Users (${data.profiles?.length || 0})` : `Orders (${data.orders?.length || 0})`}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#4A5160" }}>Auto-refreshes every 10s</span>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #1F2630", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#131822" }}>
              {tab === "users"
                ? ["Email","Phone","Plan","Status","Found us","Joined"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6B7685", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)
                : ["Email","Tier","Status","Amount","Date"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6B7685", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {tab === "users" && (data.profiles || []).map(p => (
              <tr key={p.id} style={{ borderTop: "1px solid #1F2630" }}>
                <td style={{ padding: "10px 12px" }}>{p.email || "—"}</td>
                <td style={{ padding: "10px 12px", color: "#9AA4B2" }}>{p.phone || "—"}</td>
                <td style={{ padding: "10px 12px", color: "#F2A900", fontWeight: 600 }}>{p.subscription_tier || "—"}</td>
                <td style={{ padding: "10px 12px" }}><span style={{ color: statusColor[p.subscription_status] || "#6B7685", fontWeight: 600 }}>{p.subscription_status || "none"}</span></td>
                <td style={{ padding: "10px 12px", color: "#9AA4B2" }}>{p.found_us || "—"}</td>
                <td style={{ padding: "10px 12px", color: "#6B7685", whiteSpace: "nowrap" }}>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {tab === "orders" && (data.orders || []).map(o => (
              <tr key={o.id} style={{ borderTop: "1px solid #1F2630" }}>
                <td style={{ padding: "10px 12px" }}>{o.email || "—"}</td>
                <td style={{ padding: "10px 12px", color: "#F2A900", fontWeight: 600 }}>{o.tier || "—"}</td>
                <td style={{ padding: "10px 12px" }}><span style={{ color: statusColor[o.status] || "#6B7685", fontWeight: 600 }}>{o.status}</span></td>
                <td style={{ padding: "10px 12px", fontFamily: "JetBrains Mono,monospace" }}>{o.amount_cents ? `$${(o.amount_cents / 100).toFixed(2)}` : "—"}</td>
                <td style={{ padding: "10px 12px", color: "#6B7685", whiteSpace: "nowrap" }}>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {((tab === "users" && !data.profiles?.length) || (tab === "orders" && !data.orders?.length)) && (
              <tr><td colSpan={6} style={{ padding: 20, color: "#6B7685", textAlign: "center" }}>No data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
