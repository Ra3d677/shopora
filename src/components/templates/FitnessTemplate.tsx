"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Heart,
  Zap,
  ArrowRight,
  Flame,
  Target,
  Activity,
  Scale,
  Ruler,
  Timer,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Play,
  Pause,
} from "lucide-react";

const EXERCISES = [
  { name: "Explosive Push-ups", emoji: "💥", muscle: "Chest", difficulty: "Intermediate", calories: "8-12/min" },
  { name: "Pistol Squats", emoji: "🦵", muscle: "Legs", difficulty: "Advanced", calories: "10-15/min" },
  { name: "Dragon Flag", emoji: "🐉", muscle: "Core", difficulty: "Expert", calories: "5-8/min" },
  { name: "Archer Pull-ups", emoji: "🏋️", muscle: "Back", difficulty: "Advanced", calories: "7-10/min" },
  { name: "Bulgarian Split Squats", emoji: "🔥", muscle: "Legs", difficulty: "Intermediate", calories: "9-13/min" },
  { name: "Handstand Push-ups", emoji: "🙃", muscle: "Shoulders", difficulty: "Expert", calories: "6-9/min" },
  { name: "Plyometric Lunges", emoji: "⚡", muscle: "Legs", difficulty: "Intermediate", calories: "11-16/min" },
  { name: "Muscle-ups", emoji: "💪", muscle: "Full Body", difficulty: "Expert", calories: "8-12/min" },
  { name: "Hollow Body Hold", emoji: "🧘", muscle: "Core", difficulty: "Beginner", calories: "4-6/min" },
  { name: "Glute Bridges", emoji: "🦵", muscle: "Glutes", difficulty: "Beginner", calories: "5-7/min" },
  { name: "Dips", emoji: "⬇️", muscle: "Triceps", difficulty: "Intermediate", calories: "7-10/min" },
  { name: "Burpees", emoji: "💨", muscle: "Full Body", difficulty: "Intermediate", calories: "12-18/min" },
];

const WORKOUT_NAMES = [
  "The Inferno", "Iron Will", "Beast Mode", "Turbo Charge",
  "Nightmare", "Grind Time", "Warrior's Path", "No Mercy",
  "Maximum Overdrive", "The Gauntlet",
];

const TRANSFORMATIONS = [
  { before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80", after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80", name: "Alex R.", result: "-32 lbs in 12 weeks" },
  { before: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80", after: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80", name: "Maria K.", result: "-28 lbs in 10 weeks" },
];

interface FitnessProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function AnimatedCounter({ target, suffix = "", inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/10 shadow-2xl" onMouseMove={e => handleMove(e.clientX)} onTouchMove={e => handleMove(e.touches[0].clientX)}>
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute inset-y-0" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="h-full w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-black text-[10px] font-black">
          ↔
        </div>
      </div>
    </div>
  );
}

function BodyFocusSelector({ onSelect }: { onSelect: (part: string) => void }) {
  const parts = [
    { id: "chest", label: "Chest", x: 50, y: 28, color: "from-red-500 to-rose-600" },
    { id: "shoulders", label: "Shoulders", x: 50, y: 18, color: "from-orange-500 to-amber-600" },
    { id: "biceps", label: "Arms", x: 25, y: 32, color: "from-cyan-500 to-blue-600" },
    { id: "abs", label: "Abs", x: 50, y: 42, color: "from-amber-500 to-yellow-600" },
    { id: "legs", label: "Legs", x: 50, y: 70, color: "from-emerald-500 to-green-600" },
    { id: "back", label: "Back", x: 75, y: 28, color: "from-purple-500 to-violet-600" },
  ];
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-64 h-80 mx-auto">
      <div className="absolute inset-0 bg-white/[0.02] rounded-[3rem] border border-white/5" />
      <svg viewBox="0 0 200 300" className="w-full h-full">
        <defs>
          <radialGradient id="glow"><stop offset="0%" stopColor="rgba(6,182,212,0.3)" /><stop offset="100%" stopColor="rgba(6,182,212,0)" /></radialGradient>
        </defs>
        <ellipse cx="100" cy="60" rx="35" ry="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <rect x="70" y="85" width="60" height="60" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <line x1="70" y1="115" x2="30" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <line x1="130" y1="115" x2="170" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <rect x="65" y="160" width="70" height="80" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <line x1="100" y1="240" x2="100" y2="280" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        {parts.map(p => (
          <g key={p.id} className="cursor-pointer" onClick={() => { setActive(p.id); onSelect(p.id); }}>
            <circle cx={p.x * 2} cy={p.y * 3.75} r="12" fill={active === p.id ? "rgba(6,182,212,0.2)" : "transparent"} stroke={active === p.id ? "#06b6d4" : "rgba(255,255,255,0.15)"} strokeWidth="2" />
            <text x={p.x * 2} y={p.y * 3.75 + 0.5} textAnchor="middle" dominantBaseline="middle" fill={active === p.id ? "#06b6d4" : "rgba(255,255,255,0.3)"} fontSize="7" fontWeight="800" className="pointer-events-none">{p.label}</text>
          </g>
        ))}
      </svg>
      {active && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-cyan-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
          ✓ {active.toUpperCase()} SELECTED
        </div>
      )}
    </div>
  );
}

function WorkoutGenerator() {
  const [workout, setWorkout] = useState<typeof EXERCISES>([]);
  const [name, setName] = useState("");

  const generate = () => {
    const shuffled = [...EXERCISES].sort(() => Math.random() - 0.5);
    setWorkout(shuffled.slice(0, 4));
    setName(WORKOUT_NAMES[Math.floor(Math.random() * WORKOUT_NAMES.length)]);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1 flex items-center gap-2">
            <Zap className="w-3 h-3" /> DAILY CHALLENGE
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{name || "Custom Workout"}</h3>
        </div>
        <button onClick={generate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Generate
        </button>
      </div>
      <div className="space-y-3">
        {workout.map((ex, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-lg shrink-0">
              {ex.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm truncate">{ex.name}</div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                <span>{ex.muscle}</span>
                <span>•</span>
                <span>{ex.difficulty}</span>
                <span>•</span>
                <span>{ex.calories}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-1.5 h-6 rounded-full ${s <= (i + 1) % 3 + 1 ? "bg-cyan-400" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FitnessTemplate({ banners, settings, products, slug }: FitnessProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [bmi, setBmi] = useState<{ value: number; category: string } | null>(null);
  const [bmiHeight, setBmiHeight] = useState("175");
  const [bmiWeight, setBmiWeight] = useState("75");
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef);

  const heroBg = banners[0]?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85";

  const calcBMI = () => {
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (!h || !w) return;
    const value = Math.round((w / (h * h)) * 10) / 10;
    let category = "Normal";
    if (value < 18.5) category = "Underweight";
    else if (value < 25) category = "Normal";
    else if (value < 30) category = "Overweight";
    else category = "Obese";
    setBmi({ value, category });
  };

  const bodyParts: Record<string, { exercises: string[]; tip: string }> = {
    chest: { exercises: ["Push-ups", "Bench Press", "Dumbbell Flyes"], tip: "Progressive overload is key for chest growth. Aim for 8-12 reps." },
    shoulders: { exercises: ["Overhead Press", "Lateral Raises", "Face Pulls"], tip: "Don't neglect rear delts — they're crucial for posture." },
    biceps: { exercises: ["Barbell Curls", "Hammer Curls", "Chin-ups"], tip: "Slow negatives build more muscle than swinging the weight." },
    abs: { exercises: ["Planks", "Hanging Leg Raises", "Cable Crunches"], tip: "Abs are made in the kitchen. Training just sculpts them." },
    legs: { exercises: ["Squats", "Romanian Deadlifts", "Walking Lunges"], tip: "Leg day boosts your entire metabolism. Don't skip it." },
    back: { exercises: ["Pull-ups", "Barbell Rows", "Deadlifts"], tip: "A strong back prevents injury and improves posture dramatically." },
  };

  const heroData = settings.fitnessSettings?.hero || {};
  const aboutData = settings.fitnessSettings?.about || {};
  const testimonialData = settings.fitnessSettings?.testimonials || [];

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ background: "#030507", color: "#f1f5f9" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #030507; }
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .morph-bg { animation: morph 8s ease-in-out infinite; }
        .gradient-shift { background-size: 200% 200%; animation: gradientShift 6s ease infinite; }
      `}</style>

      {/* === HERO with morphing gradient === */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030507] via-[#030507]/80 to-transparent" />
        </div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/5 rounded-full morph-bg blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-amber-500/15 to-orange-600/5 rounded-full morph-bg blur-[80px]" style={{ animationDelay: "-4s" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">{heroData.badge || "ELITE ONLINE COACHING"}</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase leading-[0.85] tracking-[-0.04em] mb-6">
              {heroData.tagline?.split(" ").map((w: string, i: number) => (
                <span key={i} className={i % 2 === 1 ? "gradient-shift bg-clip-text text-transparent" : ""} style={i % 2 === 1 ? { backgroundImage: "linear-gradient(135deg, #06b6d4, #f59e0b, #06b6d4)" } : {}}>
                  {w}{i < heroData.tagline?.split(" ").length - 1 ? " " : ""}
                </span>
              )) || (
                <>
                  <span>BUILD</span>{" "}
                  <span className="gradient-shift bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #f59e0b, #06b6d4)" }}>YOUR</span>{" "}
                  <span>BEST</span>{" "}
                  <span className="gradient-shift bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #06b6d4, #f59e0b)" }}>SELF</span>
                </>
              )}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">{heroData.subtitle || "Science-backed coaching, personalized nutrition, and relentless accountability. Transform your body and your life."}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/store/${slug}#programs`} className="group relative inline-flex items-center gap-3 bg-cyan-500 text-[#030507] h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/25 active:scale-[0.97] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`/store/${slug}#calculator`} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.97] backdrop-blur-sm">
                <Activity className="w-4 h-4" /> Check Your BMI
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* === ANIMATED STATS === */}
      <section ref={statsRef} className="py-16 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { value: 500, suffix: "+", label: "Clients Transformed", icon: TrendingUp },
              { value: 8, suffix: "+", label: "Years Coaching", icon: Timer },
              { value: 97, suffix: "%", label: "Success Rate", icon: Target },
              { value: 50, suffix: "+", label: "Programs Designed", icon: Dumbbell },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-1 font-mono">
                  {statsInView ? <AnimatedCounter target={s.value} suffix={s.suffix} inView={statsInView} /> : `0${s.suffix}`}
                </div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BODY FOCUS + BMI CALCULATOR === */}
      <section id="calculator" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Activity className="w-3.5 h-3.5" /> INTERACTIVE TOOLS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight mb-4">Know Your Body</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Click a muscle group to see targeted exercises, or calculate your BMI below.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <BodyFocusSelector onSelect={setSelectedBodyPart} />
            <div className="space-y-6">
              {selectedBodyPart && bodyParts[selectedBodyPart] ? (
                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8">
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">TARGET: {selectedBodyPart.toUpperCase()}</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Recommended Exercises</h3>
                  <div className="space-y-3 mb-6">
                    {bodyParts[selectedBodyPart].exercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs">{i + 1}</div>
                        <span className="text-white font-bold text-sm">{ex}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">💡 Coach Tip</div>
                    <p className="text-slate-300 text-sm">{bodyParts[selectedBodyPart].tip}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 text-center">
                  <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">Click a body part on the diagram to see targeted exercises and expert tips.</p>
                </div>
              )}
              {/* BMI Calculator */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">BMI Calculator</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Height (cm)</label>
                    <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Weight (kg)</label>
                    <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <button onClick={calcBMI} className="w-full py-3.5 rounded-xl bg-cyan-500 text-[#030507] font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">Calculate BMI</button>
                {bmi && (
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Your BMI</span>
                      <span className="text-3xl font-black text-white">{bmi.value}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-slate-400 text-sm">Category</span>
                      <span className={`font-black text-sm uppercase tracking-wider ${bmi.category === "Normal" ? "text-green-400" : bmi.category === "Overweight" || bmi.category === "Obese" ? "text-amber-400" : "text-cyan-400"}`}>{bmi.category}</span>
                    </div>
                    {/* BMI bar */}
                    <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full gradient-shift" style={{ width: `${Math.min((bmi.value / 40) * 100, 100)}%`, backgroundImage: "linear-gradient(90deg, #06b6d4, #f59e0b, #ef4444)" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === WORKOUT GENERATOR === */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" /> TRAINING LAB
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight mb-4">Generate Your Workout</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Click generate for a new random workout routine. Every visit is different.</p>
          </div>
          <WorkoutGenerator />
        </div>
      </section>

      {/* === PROGRAMS / PRICING with 3D tilt === */}
      <section id="programs" className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Dumbbell className="w-3.5 h-3.5" /> PROGRAMS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight mb-4">Choose Your Weapon</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every program is fully customized to your body, goals, and lifestyle.</p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
            {(products.length > 0 ? products : [
              { id: "p1", name: "Starter", price: 29, specs: [{ label: "Custom Workout Plan" }, { label: "Nutrition Guide" }, { label: "Email Support" }] },
              { id: "p2", name: "Pro", price: 59, specs: [{ label: "Everything in Starter" }, { label: "1-on-1 Video Coaching" }, { label: "Custom Meal Plans" }, { label: "24/7 WhatsApp Support" }] },
              { id: "p3", name: "Elite", price: 99, specs: [{ label: "Everything in Pro" }, { label: "Daily Check-ins" }, { label: "Video Form Analysis" }, { label: "Supplement Protocol" }] },
            ]).map((plan, idx) => {
              const isPopular = idx === 1 || (products.length > 0 && idx === Math.floor((products.length - 1) / 2));
              const step = products.length > 3 ? (idx - Math.floor(products.length / 2)) * 24 : (idx - 1) * 20;
              return (
                <div key={plan.id} className="group perspective-[1000px] flex-1" style={{ transform: `translateY(${step}px)` }}>
                  <div className={`relative rounded-[2.5rem] p-8 transition-all duration-500 hover:[transform:rotateY(-3deg)_rotateX(3deg)] cursor-default ${isPopular ? "border-2 z-10 shadow-2xl" : "bg-white/[0.02] border border-white/10 hover:border-cyan-500/30"}`} style={isPopular ? { background: "linear-gradient(145deg, rgba(6,182,212,0.08), #0a0c14)", borderColor: "#06b6d4" } : {}}>
                    {isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30">Most Popular</div>}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${isPopular ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"}`}>
                      {isPopular ? <Zap className="w-3 h-3" /> : <Dumbbell className="w-3 h-3" />}
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-5xl font-black text-white">${plan.price}</span>
                      <span className="text-slate-500 text-xs font-bold uppercase">/month</span>
                    </div>
                    <div className="w-full h-px bg-white/5 my-6" />
                    <ul className="space-y-4 mb-8">
                      {(plan.specs || []).map((spec: any, si: number) => (
                        <li key={si} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" strokeWidth={2.5} />
                          <span className="text-slate-300 text-sm">{spec.label}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.97] ${isPopular ? "bg-cyan-500 text-[#030507] hover:bg-cyan-400 shadow-xl shadow-cyan-500/20" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                      Get Started
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === TRANSFORMATIONS (Before/After) === */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> REAL TRANSFORMATIONS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight mb-4">Drag to Reveal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Slide the handle left and right to see the transformation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TRANSFORMATIONS.map((t, i) => (
              <div key={i} className="space-y-4">
                <BeforeAfterSlider before={t.before} after={t.after} />
                <div className="flex items-center justify-between px-2">
                  <span className="text-white font-bold text-sm">{t.name}</span>
                  <span className="text-cyan-400 font-black text-sm">{t.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <span>SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight">What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(testimonialData.length > 0 ? testimonialData : [
              { name: "James M.", role: "-32 lbs", content: "I've tried every program. Nothing compares. This is a complete lifestyle overhaul, not just a workout plan.", rating: 5 },
              { name: "Sophia C.", role: "Strength Athlete", content: "Went from plateauing for months to hitting PRs every week. The nutrition guidance was a game-changer.", rating: 5 },
              { name: "Marcus J.", role: "-28 lbs", content: "Custom scheduling made it possible with a 60-hour work week. Down 28 lbs and stronger than ever.", rating: 5 },
            ]).map((r: any, i: number) => (
              <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:[transform:translateY(-4px)]">
                <div className="flex gap-1 mb-5 text-amber-400">{[...Array(5)].map((_, s) => <div key={s} className="w-3 h-3 rounded-full bg-amber-400" />)}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{r.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm">{r.name.charAt(0)}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{r.name}</div>
                    <div className="text-slate-500 text-xs">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 gradient-shift opacity-5" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #f59e0b, #06b6d4)" }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">READY?</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tight mb-6">One Decision Changes Everything</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">500+ people have already taken the first step. Your future self is waiting.</p>
          <Link href={`/store/${slug}#programs`} className="group relative inline-flex items-center gap-3 bg-cyan-500 text-[#030507] h-16 px-12 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/25 active:scale-[0.97] overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            Start Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-16 border-t border-white/5" style={{ background: "#020306" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-white font-black text-xl uppercase tracking-tight italic">{settings.storeName || "FITNESS COACH"}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Science-backed training, personalized nutrition, and accountability that transforms lives.</p>
              <div className="flex gap-3">
                {["📸", "🎥", "🔗"].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 hover:border-cyan-500/30 transition-all">{icon}</a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <Link href={`/store/${slug}`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">Home</Link>
                <Link href={`/store/${slug}#programs`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">Programs</Link>
                <Link href={`/store/${slug}#calculator`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">BMI Calculator</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact</h4>
              <div className="flex flex-col gap-3 text-slate-500 text-sm">
                <span>✉️ coach@{slug}.com</span>
                <span>📞 +1 (555) 000-0000</span>
                <span>🌍 Online Worldwide</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">&copy; 2026 {settings.storeName || "FITNESS COACH"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
