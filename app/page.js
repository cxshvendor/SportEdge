"use client";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();
  return (
    <div className="page" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 0 }}>
      <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 42, marginBottom: 10 }}>
        SPORTS<span style={{ color: "#2B9DFF" }}>EDGE</span>
      </div>
      <div className="subtitle" style={{ maxWidth: 300 }}>Live odds. Live news. AI research built for sharp bettors.</div>
      <button className="btn" style={{ maxWidth: 300, marginTop: 32 }} onClick={() => router.push("/onboarding")}>Get started</button>
      <div style={{ marginTop: 20 }}><a className="link" href="/login">Already have an account? Log in</a></div>
    </div>
  );
}
