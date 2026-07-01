"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../globals.css";

const SPORTS = ["NBA","NFL","MLB","NHL","WNBA","Soccer","Tennis","MMA","College Football","College Basketball"];
const FANTASY = [
  { key: "Sit/Start", e: "🪑" }, { key: "Drafting", e: "📝" }, { key: "Waiver Wire", e: "🔄" },
  { key: "Trades", e: "🤝" }, { key: "Injury Updates", e: "🏥" }, { key: "DFS Lineups", e: "📋" },
];
const TIME = ["Less than an hour","A few hours","Several hours","It's basically a job"];
const STYLE = [
  { key: "I do my own research", sub: "I want sharper tools and better data." },
  { key: "I follow picks", sub: "I want a shortcut to good decisions." },
  { key: "I go by feel", sub: "I want a second opinion before I lock it in." },
  { key: "I'm still figuring out my style.", sub: "" },
];
const FOUND = ["TikTok","Google Search","Instagram","X (Twitter)","Reddit","Discord","A Friend","ChatGPT","Claude","YouTube","Somewhere else"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [a, setA] = useState({ sports: [], bettingStyle: "", experience: "", fantasy: [], time: "", style: "", foundUs: "" });

  const toggle = (field, val, multi = true) => setA(prev => {
    if (!multi) return { ...prev, [field]: val };
    const cur = prev[field];
    return { ...prev, [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
  });

  const next = () => {
    if (step < 7) setStep(s => s + 1);
    else {
      sessionStorage.setItem("onboarding", JSON.stringify(a));
      router.push("/signup");
    }
  };

  const Card = ({ field, val, multi = true, sub, emoji }) => (
    <div className={`option-card ${(multi ? a[field].includes(val) : a[field] === val) ? "sel" : ""}`} onClick={() => toggle(field, val, multi)}>
      {emoji && <span style={{ fontSize: 20 }}>{emoji}</span>}
      <div><div className="opt-title">{val}</div>{sub && <div className="opt-sub">{sub}</div>}</div>
    </div>
  );

  return (
    <div className="page">
      <div className="progress-bar">{Array.from({ length: 7 }).map((_, i) => <div key={i} className={`seg ${i < step ? "active" : ""}`} />)}</div>
      {step > 1 && <button className="back-btn" onClick={() => setStep(s => s - 1)}><ChevronLeft size={16} /> Back</button>}
      <div className="step-label">STEP {step} OF 7</div>

      {step === 1 && (<><div className="title">Which sports do you follow?</div><div className="subtitle">Select all that apply</div>{SPORTS.map(s => <Card key={s} field="sports" val={s} />)}</>)}
      {step === 2 && (<><div className="title">Do you bet, play fantasy, or both?</div>{["Sports betting","Fantasy sports","Both","Just here to learn"].map(s => <Card key={s} field="bettingStyle" val={s} multi={false} />)}</>)}
      {step === 3 && (<><div className="title">What's your experience level?</div>{["New to this","Some experience","Pretty experienced","Sharp / professional"].map(s => <Card key={s} field="experience" val={s} multi={false} />)}</>)}
      {step === 4 && (<><div className="title">What fantasy decisions are you most focused on?</div><div className="subtitle">Select all that apply</div>{FANTASY.map(o => <Card key={o.key} field="fantasy" val={o.key} emoji={o.e} />)}</>)}
      {step === 5 && (<><div className="title">How much time do you spend researching each week?</div>{TIME.map(s => <Card key={s} field="time" val={s} multi={false} />)}</>)}
      {step === 6 && (<><div className="title">Which of these sounds more like you?</div>{STYLE.map(o => <Card key={o.key} field="style" val={o.key} sub={o.sub} multi={false} />)}</>)}
      {step === 7 && (<><div className="title">How'd you find us?</div>{FOUND.map(s => <Card key={s} field="foundUs" val={s} multi={false} />)}</>)}

      <button className="btn" onClick={next}>{step < 7 ? "Continue" : "Let's go"} <ChevronRight size={18} /></button>
    </div>
  );
}
