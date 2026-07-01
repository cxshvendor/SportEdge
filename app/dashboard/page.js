"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X, Newspaper, BarChart3, MessageSquare, TrendingUp, Layers, LogOut, Send, Loader2, RefreshCw, Zap, ChevronRight } from "lucide-react";
import { supabaseBrowser } from "../../lib/supabase";
import "../globals.css";

// ── Paywall ──────────────────────────────────────────────────────────────────
function Paywall({ userId, email, onClose }) {
  const [sel, setSel] = useState("annual"); const [loading, setLoading] = useState(false);
  const TIERS = [
    { key: "weekly", label: "Weekly", price: "$12.99", per: "/week", note: "Just $12.99/week", trial: false },
    { key: "monthly", label: "Monthly", price: "$29.99", per: "/month", note: "3-day free trial, then $29.99/mo", trial: true },
    { key: "annual", label: "Annual", price: "$129.99", per: "/year", note: "3-day free trial, then $129.99/year", trial: true, save: "Save 64%", pop: true },
  ];
  const go = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier: sel, userId, email }) });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
    setLoading(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0B0E14", zIndex: 100, overflowY: "auto" }}>
      <div className="page">
        <button onClick={onClose} style={{ background: "#1B2230", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#E8ECF1", cursor: "pointer", marginBottom: 16 }}><X size={16} /></button>
        <div className="title" style={{ fontSize: 34 }}>Get Your Edge</div>
        <div className="subtitle">Cancel anytime during your trial.</div>
        {TIERS.map(t => (
          <div key={t.key} className={`price-card ${sel === t.key ? "sel" : ""}`} onClick={() => setSel(t.key)}>
            {t.pop && <div className="pop-badge">✦ MOST POPULAR</div>}
            <div className="price-name">{t.label}</div>
            <span className="price-amt">{t.price}</span><span className="price-per">{t.per}</span>
            <div style={{ fontSize: 12.5, color: "#9AA4B2", marginTop: 6 }}>{t.note}</div>
            {t.trial && <span className="tag tag-blue">3-Days Free Trial</span>}
            {t.save && <span className="tag tag-green">{t.save}</span>}
          </div>
        ))}
        <button className="btn cyan" onClick={go} disabled={loading}>{loading ? "Loading…" : "START FREE TRIAL →"}</button>
      </div>
    </div>
  );
}

// ── News Ticker ───────────────────────────────────────────────────────────────
function NewsTicker() {
  const [headlines, setHeadlines] = useState(["Loading live sports headlines…"]); const [loading, setLoading] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { const r = await fetch("/api/news"); const d = await r.json(); if (d.headlines?.length) setHeadlines(d.headlines); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); const id = setInterval(load, 60000); return () => clearInterval(id); }, [load]);
  const loop = [...headlines, ...headlines];
  return (
    <div style={{ display: "flex", alignItems: "center", background: "#0F141C", borderBottom: "1px solid #1F2630", height: 34, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#FF4757", color: "#0B0E14", fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 11, padding: "0 10px", height: "100%", flexShrink: 0 }}><Zap size={12} /> LIVE</div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 40s linear infinite" }}>
          {loop.map((h, i) => <span key={i} style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11.5, color: "#C7CFDA", padding: "0 18px 0 0" }}>{h} <span style={{ color: "#F2A900" }}>●</span></span>)}
        </div>
      </div>
      <button onClick={load} style={{ background: "none", border: "none", color: "#6B7685", padding: "0 10px", cursor: "pointer" }}><RefreshCw size={13} className={loading ? "spin" : ""} /></button>
    </div>
  );
}

// ── Side Menu ─────────────────────────────────────────────────────────────────
function SideMenu({ tab, setTab, onClose, profile }) {
  const items = [
    { key: "news", label: "Breaking News", icon: Newspaper },
    { key: "odds", label: "Live Odds", icon: BarChart3 },
    { key: "chat", label: "AI Chat", icon: MessageSquare },
    { key: "props", label: "Prop Analysis", icon: TrendingUp },
    { key: "parlay", label: "Parlay Builder", icon: Layers },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 50 }} onClick={onClose}>
      <div style={{ width: 260, height: "100%", background: "#0D121A", borderRight: "1px solid #1F2630", padding: 20, display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7685", cursor: "pointer", marginBottom: 24, alignSelf: "flex-start" }}><X size={18} /></button>
        <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>SPORTS<span style={{ color: "#2B9DFF" }}>EDGE</span></div>
        {items.map(it => { const Icon = it.icon; return (
          <div key={it.key} onClick={() => setTab(it.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", borderRadius: 9, cursor: "pointer", background: tab === it.key ? "#1B2230" : "transparent", color: tab === it.key ? "#2B9DFF" : "#C7CFDA", marginBottom: 4 }}>
            <Icon size={16} /> <span style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</span>
          </div>
        ); })}
        <div style={{ marginTop: "auto", background: "#131822", borderRadius: 10, padding: 12, fontSize: 12, color: "#6B7685" }}>
          <div>{profile?.email}</div>
          <div style={{ marginTop: 4 }}>Plan: <span style={{ color: "#E8ECF1", fontWeight: 600 }}>{profile?.subscription_tier || "none"}</span></div>
          <div>Status: <span style={{ color: ["active","trialing"].includes(profile?.subscription_status) ? "#00D87A" : "#FF4757", fontWeight: 600 }}>{profile?.subscription_status || "inactive"}</span></div>
        </div>
      </div>
    </div>
  );
}

// ── News Tab ──────────────────────────────────────────────────────────────────
function NewsTab() {
  const [headlines, setHeadlines] = useState([]); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/news"); const d = await r.json(); setHeadlines(d.headlines || []); setLoading(false); };
  useEffect(() => { load(); const id = setInterval(load, 60000); return () => clearInterval(id); }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0" }}>
        <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 20 }}>Breaking News</div>
        <button onClick={load} style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 8, padding: 7, color: "#6B7685", cursor: "pointer" }}><RefreshCw size={14} className={loading ? "spin" : ""} /></button>
      </div>
      {loading && <div style={{ color: "#6B7685" }}>Fetching latest news…</div>}
      {headlines.map((h, i) => <div key={i} style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 14, lineHeight: 1.5 }}>{h}</div>)}
    </div>
  );
}

// ── Odds Tab ──────────────────────────────────────────────────────────────────
function OddsTab() {
  const [sport, setSport] = useState("nba"); const [games, setGames] = useState([]); const [meta, setMeta] = useState(null); const [loading, setLoading] = useState(true);
  const load = useCallback(async (s) => { setLoading(true); const r = await fetch(`/api/odds?sport=${s}`); const d = await r.json(); setGames(d.games || []); setMeta(d.meta); setLoading(false); }, []);
  useEffect(() => { load(sport); }, [sport]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 10px" }}>
        <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 20 }}>Live Odds</div>
        <select value={sport} onChange={e => { setSport(e.target.value); load(e.target.value); }} style={{ background: "#131822", border: "1px solid #232B38", borderRadius: 8, color: "#E8ECF1", padding: "6px 10px", fontSize: 12.5 }}>
          {["nba","nfl","mlb","nhl","wnba","soccer"].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>
      {meta && <div style={{ fontSize: 10.5, color: "#4A5160", marginBottom: 10 }}>Real sportsbook lines · {meta.remaining} API requests remaining · updated {new Date(meta.fetchedAt).toLocaleTimeString()}</div>}
      {loading && <div style={{ color: "#6B7685" }}>Loading real sportsbook lines…</div>}
      {!loading && !games.length && <div style={{ color: "#6B7685" }}>No games available right now, or check your Odds API key in Vercel env vars.</div>}
      {games.map(g => (
        <div key={g.id} style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{g.away_team} @ {g.home_team}</div>
          <div style={{ fontSize: 11, color: "#6B7685", marginBottom: 8 }}>{g.bookmakers?.[0]?.title || "—"} · {new Date(g.commence_time).toLocaleString()}</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {g.bookmakers?.[0]?.markets?.[0]?.outcomes?.map(o => (
              <span key={o.name} style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 13, color: "#F2A900" }}>{o.name}: {o.price > 0 ? `+${o.price}` : o.price}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Chat Tab ──────────────────────────────────────────────────────────────────
function ChatTab({ userId }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Ask me about any prop, matchup, injury, or what's moving tonight." }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);
  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...msgs, { role: "user", content: input.trim() }]; setMsgs(next); setInput(""); setLoading(true);
    const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, userId }) });
    const d = await r.json();
    setMsgs(m => [...m, { role: "assistant", content: d.reply || "Something went wrong — try again." }]); setLoading(false);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ height: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {msgs.map((m, i) => <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "10px 13px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.5, background: m.role === "user" ? "#2B9DFF" : "#1B2230", color: m.role === "user" ? "#061018" : "#E8ECF1", fontWeight: m.role === "user" ? 500 : 400 }}>{m.content}</div>)}
        {loading && <div style={{ color: "#6B7685", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}><Loader2 size={13} className="spin" /> analyzing…</div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="field" style={{ marginBottom: 0 }} placeholder="Ask anything about sports…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button onClick={send} disabled={loading} style={{ background: "#2B9DFF", border: "none", borderRadius: 9, width: 44, color: "#061018", cursor: "pointer" }}><Send size={16} /></button>
      </div>
    </div>
  );
}

// ── Props Tab ─────────────────────────────────────────────────────────────────
function PropsTab({ userId }) {
  const [player, setPlayer] = useState(""); const [prop, setProp] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState(null); const [err, setErr] = useState("");
  const analyze = async () => {
    if (!player || !prop) return; setLoading(true); setResult(null); setErr("");
    const r = await fetch("/api/prop-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ player, prop, userId }) });
    const d = await r.json(); if (d.error) setErr(d.error); else setResult(d); setLoading(false);
  };
  const recColor = { OVER: "#00D87A", UNDER: "#FF4757", PASS: "#9AA4B2" };
  return (
    <div style={{ marginTop: 16 }}>
      <input className="field" placeholder="Player name (e.g. Jalen Brunson)" value={player} onChange={e => setPlayer(e.target.value)} />
      <input className="field" placeholder="Prop (e.g. Over 3.5 rebounds)" value={prop} onChange={e => setProp(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()} />
      <button className="btn" style={{ marginTop: 0, background: "#2B9DFF", color: "#061018" }} onClick={analyze} disabled={loading}>{loading ? <><Loader2 size={15} className="spin" /> Analyzing…</> : "Analyze Prop"}</button>
      {err && <div className="err" style={{ marginTop: 12 }}>{err}</div>}
      {result && (
        <div style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div><div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 18 }}>{result.player}</div><div style={{ color: "#9AA4B2", fontSize: 13 }}>{result.prop}</div></div>
            <div style={{ background: recColor[result.recommendation] + "22", color: recColor[result.recommendation], fontWeight: 700, fontSize: 13, padding: "6px 12px", borderRadius: 8 }}>{result.recommendation}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["Confidence", result.confidence + "%"], ["Hit Rate", result.hitRateRecent], ["Edge", result.edgePercent + "%"]].map(([l, v]) => (
              <div key={l} style={{ background: "#0B0E14", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9.5, color: "#6B7685", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{l}</div>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700, fontSize: 15, color: "#F2A900" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: "#C7CFDA", borderTop: "1px solid #1F2630", paddingTop: 10 }}><span style={{ color: "#F2A900", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em" }}>KEY FACTOR </span>{result.keyFactor}</div>
        </div>
      )}
      <div style={{ fontSize: 10.5, color: "#4A5160", textAlign: "center", marginTop: 16 }}>Informational only — not betting advice. Bet responsibly.</div>
    </div>
  );
}

// ── Parlay Tab ────────────────────────────────────────────────────────────────
function ParlayTab({ userId }) {
  const [sport, setSport] = useState("NBA"); const [legs, setLegs] = useState(3); const [risk, setRisk] = useState("Balanced"); const [loading, setLoading] = useState(false); const [result, setResult] = useState(null); const [err, setErr] = useState("");
  const build = async () => {
    setLoading(true); setResult(null); setErr("");
    const r = await fetch("/api/parlay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sport, legs, risk, userId }) });
    const d = await r.json(); if (d.error) setErr(d.error); else setResult(d); setLoading(false);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <select className="field" style={{ marginBottom: 0, flex: 1 }} value={sport} onChange={e => setSport(e.target.value)}>{["NBA","NFL","MLB","NHL","WNBA","Soccer"].map(s => <option key={s}>{s}</option>)}</select>
        <select className="field" style={{ marginBottom: 0, flex: 1 }} value={legs} onChange={e => setLegs(Number(e.target.value))}>{[2,3,4,5,6].map(n => <option key={n} value={n}>{n} legs</option>)}</select>
        <select className="field" style={{ marginBottom: 0, flex: 1 }} value={risk} onChange={e => setRisk(e.target.value)}>{["Safe","Balanced","Longshot"].map(r => <option key={r}>{r}</option>)}</select>
      </div>
      <button className="btn" style={{ marginTop: 0, background: "#2B9DFF", color: "#061018" }} onClick={build} disabled={loading}>{loading ? <><Loader2 size={15} className="spin" /> Building…</> : "Build Parlay"}</button>
      {err && <div className="err" style={{ marginTop: 12 }}>{err}</div>}
      {result?.legs && (
        <div style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #1F2630" }}>
            <div><div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 16 }}>{legs}-Leg {sport} Parlay</div><div style={{ color: "#6B7685", fontSize: 12 }}>{risk} risk</div></div>
            <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700, fontSize: 22, color: "#00D87A" }}>{result.combinedOdds}</div>
          </div>
          {result.legs.map((l, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div><span style={{ fontWeight: 600, fontSize: 13.5 }}>{l.player}</span> <span style={{ color: "#6B7685", fontSize: 11 }}>{l.team}</span></div>
                <span style={{ fontFamily: "JetBrains Mono,monospace", color: "#F2A900", fontSize: 13, fontWeight: 700 }}>{l.odds}</span>
              </div>
              <div style={{ color: "#9AA4B2", fontSize: 12.5, marginTop: 2 }}>{l.prop}</div>
              <div style={{ color: "#6B7685", fontSize: 11.5, marginTop: 2 }}>{l.rationale}</div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1F2630", paddingTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#6B7685" }}>Confidence</span>
            <div style={{ flex: 1, height: 5, background: "#1B2230", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${result.overallConfidence}%`, height: "100%", background: "linear-gradient(90deg,#F2A900,#00D87A)" }} /></div>
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700, fontSize: 13 }}>{result.overallConfidence}%</span>
          </div>
        </div>
      )}
      <div style={{ fontSize: 10.5, color: "#4A5160", textAlign: "center", marginTop: 16 }}>Informational only — not betting advice. Bet responsibly.</div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter(); const params = useSearchParams();
  const sb = supabaseBrowser();
  const [user, setUser] = useState(null); const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); const [tab, setTab] = useState("news"); const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) return router.push("/login");
      setUser(data.user);
      const { data: prof } = await sb.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(prof);
      const inactive = !prof || ["none","canceled","past_due"].includes(prof?.subscription_status);
      if (inactive || params.get("paywall") === "1") setPaywall(true);
    });
  }, []);

  const logout = async () => { await sb.auth.signOut(); router.push("/login"); };

  if (!user) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7685" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0B0E14" }}>
      {paywall && <Paywall userId={user.id} email={user.email} onClose={() => setPaywall(false)} />}
      <NewsTicker />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px 10px" }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: "#131822", border: "1px solid #1F2630", borderRadius: 9, padding: 9, color: "#E8ECF1", cursor: "pointer" }}><Menu size={18} /></button>
        <div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 20 }}>SPORTS<span style={{ color: "#2B9DFF" }}>EDGE</span></div>
        <button onClick={logout} style={{ background: "none", border: "none", color: "#6B7685", cursor: "pointer" }}><LogOut size={18} /></button>
      </div>
      {menuOpen && <SideMenu tab={tab} setTab={t => { setTab(t); setMenuOpen(false); }} onClose={() => setMenuOpen(false)} profile={profile} />}
      <div style={{ padding: "0 18px 32px", flex: 1 }}>
        {tab === "news" && <NewsTab />}
        {tab === "odds" && <OddsTab />}
        {tab === "chat" && <ChatTab userId={user.id} />}
        {tab === "props" && <PropsTab userId={user.id} />}
        {tab === "parlay" && <ParlayTab userId={user.id} />}
      </div>
    </div>
  );
}
