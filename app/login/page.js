"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase";
import "../globals.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/dashboard");
  };

  return (
    <div className="page">
      <div className="title">Welcome back</div>
      <div className="subtitle">Log in to access your dashboard.</div>
      <input className="field" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="field" type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
      {err && <div className="err">{err}</div>}
      <button className="btn" onClick={submit} disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
      <div style={{ textAlign: "center", marginTop: 16 }}><a className="link" href="/signup">Don't have an account? Sign up</a></div>
    </div>
  );
}
