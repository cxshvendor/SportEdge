"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase";
import "../globals.css";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); if (!email || !pw) return setErr("Email and password required."); if (pw.length < 8) return setErr("Password must be 8+ characters.");
    setLoading(true);
    const sb = supabaseBrowser();
    const { data, error } = await sb.auth.signUp({ email, password: pw });
    if (error) { setErr(error.message); setLoading(false); return; }
    if (data.user) {
      const raw = sessionStorage.getItem("onboarding");
      const ans = raw ? JSON.parse(raw) : {};
      await sb.from("profiles").update({ phone, sports: ans.sports, betting_style: ans.bettingStyle, experience: ans.experience, fantasy_focus: ans.fantasy, time_spent: ans.time, research_style: ans.style, found_us: ans.foundUs, onboarding_complete: true }).eq("id", data.user.id);
    }
    router.push("/dashboard?paywall=1");
  };

  return (
    <div className="page">
      <div className="title">Create your account</div>
      <div className="subtitle">Your picks, history, and subscription are saved to your account.</div>
      <input className="field" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="field" placeholder="Phone number (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
      <input className="field" type="password" placeholder="Password (8+ characters)" value={pw} onChange={e => setPw(e.target.value)} />
      {err && <div className="err">{err}</div>}
      <button className="btn" onClick={submit} disabled={loading}>{loading ? "Creating account…" : "Sign up"}</button>
      <div style={{ textAlign: "center", marginTop: 16 }}><a className="link" href="/login">Already have an account? Log in</a></div>
    </div>
  );
}
