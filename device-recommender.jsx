import { useState, useMemo } from "react";
import {
  Smartphone,
  Tablet,
  Tv,
  Laptop,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";

/* ----------------------------- DATA LAYER ----------------------------- */

const CATEGORIES = [
  { id: "phone", label: "Phone", icon: Smartphone, tagline: "Pocket computer, camera, and everything else" },
  { id: "tablet", label: "Tablet", icon: Tablet, tagline: "Bigger screen for reading, drawing, or work" },
  { id: "tv", label: "TV", icon: Tv, tagline: "For the living room" },
  { id: "laptop", label: "Computer", icon: Laptop, tagline: "Laptops and everyday desktops" },
];

const PRIORITY_LABELS = {
  camera: "Camera quality",
  battery: "Battery life",
  performance: "Raw performance",
  display: "Display quality",
  portability: "Portability",
  longevity: "Software support",
  value: "Value for money",
  stylus: "Pen / stylus support",
  picture: "Picture quality",
  gaming: "Gaming features",
  brightness: "Brightness",
  sound: "Built-in sound",
  smart: "Smart features",
  storage: "Storage",
};

const CONFIG = {
  phone: {
    uses: [
      { id: "photo", label: "Photography & content creation", boost: { camera: 2, display: 1 } },
      { id: "gaming", label: "Gaming & performance", boost: { performance: 2, battery: 1 } },
      { id: "everyday", label: "Everyday use & battery life", boost: { battery: 2, value: 1 } },
      { id: "work", label: "Business & productivity", boost: { longevity: 2, performance: 1 } },
      { id: "budget", label: "Budget-friendly essentials", boost: { value: 2, battery: 1 } },
    ],
    priorities: ["camera", "battery", "performance", "display", "portability", "longevity", "value"],
    budgets: [
      { id: "budget", label: "Under $600", max: 600 },
      { id: "mid", label: "$600 – $1,000", max: 1000 },
      { id: "premium", label: "No limit", max: Infinity },
    ],
    devices: [
      { name: "iPhone 17 Pro", brand: "Apple", price: 1099, blurb: "Apple's flagship, built for camera and speed.",
        specs: [["Display", "6.3\" OLED, 120Hz"], ["Chip", "A19 Pro"], ["Battery", "~29 hrs video"], ["Storage", "256GB+"], ["Camera", "Triple 48MP, 5x tele"]],
        scores: { camera: 9.5, battery: 8, performance: 9.5, display: 9, portability: 7, longevity: 10, value: 6 } },
      { name: "iPhone 16e", brand: "Apple", price: 599, blurb: "Apple essentials without the premium price.",
        specs: [["Display", "6.1\" OLED, 60Hz"], ["Chip", "A18"], ["Battery", "~26 hrs video"], ["Storage", "128GB+"], ["Camera", "Single 48MP"]],
        scores: { camera: 7, battery: 7.5, performance: 8, display: 7, portability: 8, longevity: 10, value: 8 } },
      { name: "Galaxy S25 Ultra", brand: "Samsung", price: 1299, blurb: "The do-everything Android flagship with a stylus.",
        specs: [["Display", "6.9\" AMOLED, 120Hz"], ["Chip", "Snapdragon 8 Elite"], ["Battery", "5000mAh"], ["Storage", "256GB+"], ["Camera", "Quad, 200MP main"]],
        scores: { camera: 9.5, battery: 8.5, performance: 9.5, display: 9.5, portability: 6, longevity: 9, value: 6 } },
      { name: "Galaxy A56", brand: "Samsung", price: 449, blurb: "Reliable mid-ranger with a big battery.",
        specs: [["Display", "6.7\" AMOLED, 120Hz"], ["Chip", "Exynos 1580"], ["Battery", "5000mAh"], ["Storage", "128GB+"], ["Camera", "Triple 50MP"]],
        scores: { camera: 6.5, battery: 8, performance: 6.5, display: 7, portability: 8, longevity: 7, value: 9 } },
      { name: "Pixel 10 Pro", brand: "Google", price: 999, blurb: "The best point-and-shoot camera on Android.",
        specs: [["Display", "6.3\" OLED, 120Hz"], ["Chip", "Tensor G5"], ["Battery", "~24 hrs"], ["Storage", "128GB+"], ["Camera", "Triple 50MP, 5x tele"]],
        scores: { camera: 9.5, battery: 8, performance: 8.5, display: 9, portability: 7, longevity: 9.5, value: 7 } },
      { name: "Pixel 9a", brand: "Google", price: 499, blurb: "Clean software and a great camera for the price.",
        specs: [["Display", "6.1\" OLED, 60Hz"], ["Chip", "Tensor G4"], ["Battery", "5100mAh"], ["Storage", "128GB+"], ["Camera", "Dual 48MP"]],
        scores: { camera: 8, battery: 8.5, performance: 7, display: 7, portability: 8, longevity: 9, value: 9 } },
    ],
  },
  tablet: {
    uses: [
      { id: "creative", label: "Creative work & drawing", boost: { stylus: 2, display: 1 } },
      { id: "media", label: "Entertainment & media", boost: { display: 2, battery: 1 } },
      { id: "notes", label: "Productivity & note-taking", boost: { stylus: 1, performance: 1 } },
      { id: "kids", label: "Kids & family use", boost: { value: 2, portability: 1 } },
      { id: "laptop-replace", label: "Portable computer replacement", boost: { performance: 2, portability: 1 } },
    ],
    priorities: ["display", "performance", "battery", "stylus", "portability", "value"],
    budgets: [
      { id: "budget", label: "Under $400", max: 400 },
      { id: "mid", label: "$400 – $900", max: 900 },
      { id: "premium", label: "No limit", max: Infinity },
    ],
    devices: [
      { name: "iPad Pro (M4)", brand: "Apple", price: 999, blurb: "Desktop-class power in a tablet body.",
        specs: [["Display", "13\" tandem OLED"], ["Chip", "Apple M4"], ["Battery", "~10 hrs"], ["Pencil", "Pro (sold separately)"], ["Weight", "579g"]],
        scores: { display: 9.5, performance: 9.5, battery: 8.5, stylus: 9.5, portability: 7.5, value: 6 } },
      { name: "iPad Air (M2)", brand: "Apple", price: 599, blurb: "Most of the Pro's ability for less.",
        specs: [["Display", "11\" Liquid Retina"], ["Chip", "Apple M2"], ["Battery", "~10 hrs"], ["Pencil", "Pro / USB-C"], ["Weight", "462g"]],
        scores: { display: 8.5, performance: 8.5, battery: 8.5, stylus: 9, portability: 8, value: 8 } },
      { name: "iPad (11th gen)", brand: "Apple", price: 349, blurb: "The simple, affordable default choice.",
        specs: [["Display", "10.9\" Liquid Retina"], ["Chip", "A16"], ["Battery", "~10 hrs"], ["Pencil", "USB-C"], ["Weight", "477g"]],
        scores: { display: 7, performance: 6.5, battery: 8, stylus: 6.5, portability: 8.5, value: 9 } },
      { name: "Galaxy Tab S10+", brand: "Samsung", price: 999, blurb: "Big AMOLED canvas with S Pen included.",
        specs: [["Display", "12.4\" AMOLED, 120Hz"], ["Chip", "Dimensity 9300+"], ["Battery", "10090mAh"], ["Pencil", "S Pen included"], ["Weight", "571g"]],
        scores: { display: 9, performance: 8.5, battery: 8, stylus: 9, portability: 7, value: 6.5 } },
      { name: "Galaxy Tab A9+", brand: "Samsung", price: 220, blurb: "Cheap, cheerful, good enough for streaming.",
        specs: [["Display", "11\" LCD, 90Hz"], ["Chip", "Snapdragon 695"], ["Battery", "7040mAh"], ["Pencil", "Not supported"], ["Weight", "480g"]],
        scores: { display: 6, performance: 5.5, battery: 7.5, stylus: 3, portability: 8.5, value: 8.5 } },
      { name: "Surface Pro 11", brand: "Microsoft", price: 999, blurb: "Runs full Windows apps, keyboard sold separately.",
        specs: [["Display", "13\" PixelSense, 120Hz"], ["Chip", "Snapdragon X Elite"], ["Battery", "~14 hrs"], ["Pencil", "Slim Pen 2"], ["Weight", "895g"]],
        scores: { display: 8.5, performance: 8.5, battery: 7.5, stylus: 8.5, portability: 6.5, value: 6 } },
    ],
  },
  tv: {
    uses: [
      { id: "cinema", label: "Movie & home theater", boost: { picture: 2, sound: 1 } },
      { id: "gaming", label: "Gaming (console / PC)", boost: { gaming: 2, picture: 1 } },
      { id: "streaming", label: "Everyday streaming", boost: { smart: 2, value: 1 } },
      { id: "bright", label: "Bright room / daytime viewing", boost: { brightness: 2 } },
      { id: "upgrade", label: "Budget upgrade", boost: { value: 2, picture: 1 } },
    ],
    priorities: ["picture", "gaming", "brightness", "sound", "smart", "value"],
    budgets: [
      { id: "budget", label: "Under $700", max: 700 },
      { id: "mid", label: "$700 – $1,400", max: 1400 },
      { id: "premium", label: "No limit", max: Infinity },
    ],
    devices: [
      { name: "LG C4 OLED 65\"", brand: "LG", price: 1699, blurb: "The gold standard for movies and console gaming.",
        specs: [["Panel", "OLED"], ["Refresh", "144Hz"], ["HDR", "Dolby Vision, HDR10"], ["Inputs", "4x HDMI 2.1"], ["Smart", "webOS"]],
        scores: { picture: 9.5, gaming: 9.5, brightness: 7.5, sound: 7, smart: 8.5, value: 7 } },
      { name: "Samsung QN90D", brand: "Samsung", price: 1799, blurb: "Blazing bright Neo QLED, great for daytime rooms.",
        specs: [["Panel", "Mini-LED QLED"], ["Refresh", "144Hz"], ["HDR", "HDR10+"], ["Inputs", "4x HDMI 2.1"], ["Smart", "Tizen"]],
        scores: { picture: 9, gaming: 9, brightness: 9.5, sound: 7.5, smart: 8.5, value: 6.5 } },
      { name: "Sony Bravia 7", brand: "Sony", price: 1599, blurb: "Excellent motion handling and film-accurate color.",
        specs: [["Panel", "Mini-LED"], ["Refresh", "120Hz"], ["HDR", "Dolby Vision"], ["Inputs", "2x HDMI 2.1"], ["Smart", "Google TV"]],
        scores: { picture: 9, gaming: 8.5, brightness: 8.5, sound: 8, smart: 8, value: 7 } },
      { name: "TCL QM7", brand: "TCL", price: 899, blurb: "Mini-LED brightness at a mid-range price.",
        specs: [["Panel", "Mini-LED QLED"], ["Refresh", "120Hz"], ["HDR", "Dolby Vision"], ["Inputs", "2x HDMI 2.1"], ["Smart", "Google TV"]],
        scores: { picture: 8, gaming: 8, brightness: 8.5, sound: 6.5, smart: 7.5, value: 9 } },
      { name: "Hisense U6/U7", brand: "Hisense", price: 549, blurb: "The budget pick that still does HDR justice.",
        specs: [["Panel", "VA LED"], ["Refresh", "120Hz"], ["HDR", "Dolby Vision"], ["Inputs", "1x HDMI 2.1"], ["Smart", "Google TV"]],
        scores: { picture: 7, gaming: 7.5, brightness: 7.5, sound: 6, smart: 7, value: 9 } },
      { name: "LG B4 OLED 55\"", brand: "LG", price: 1099, blurb: "Entry-level OLED, deep blacks on a smaller budget.",
        specs: [["Panel", "OLED"], ["Refresh", "120Hz"], ["HDR", "Dolby Vision"], ["Inputs", "4x HDMI 2.1"], ["Smart", "webOS"]],
        scores: { picture: 8.5, gaming: 8.5, brightness: 6.5, sound: 6.5, smart: 8, value: 7.5 } },
    ],
  },
  laptop: {
    uses: [
      { id: "creative", label: "Creative work (video / photo editing)", boost: { performance: 2, display: 1 } },
      { id: "gaming", label: "Gaming", boost: { performance: 2, display: 1 } },
      { id: "dev", label: "Programming & development", boost: { performance: 1, battery: 1 } },
      { id: "office", label: "Everyday browsing & office work", boost: { battery: 1, value: 1 } },
      { id: "travel", label: "Portability & travel", boost: { portability: 2, battery: 1 } },
    ],
    priorities: ["performance", "battery", "display", "portability", "storage", "value"],
    budgets: [
      { id: "budget", label: "Under $800", max: 800 },
      { id: "mid", label: "$800 – $1,500", max: 1500 },
      { id: "premium", label: "No limit", max: Infinity },
    ],
    devices: [
      { name: "MacBook Pro 14\" (M4 Pro)", brand: "Apple", price: 1999, blurb: "Pro-grade performance for creative workloads.",
        specs: [["Chip", "Apple M4 Pro"], ["Display", "14\" Liquid Retina XDR"], ["Battery", "~18 hrs"], ["Storage", "512GB+"], ["Weight", "1.6kg"]],
        scores: { performance: 9.5, battery: 9, display: 9.5, portability: 7.5, storage: 8.5, value: 6.5 } },
      { name: "MacBook Air 13\" (M3)", brand: "Apple", price: 1099, blurb: "Light, fast, and quiet — a great all-rounder.",
        specs: [["Chip", "Apple M3"], ["Display", "13.6\" Liquid Retina"], ["Battery", "~18 hrs"], ["Storage", "256GB+"], ["Weight", "1.24kg"]],
        scores: { performance: 8, battery: 9.5, display: 8.5, portability: 9.5, storage: 7, value: 8 } },
      { name: "Dell XPS 13", brand: "Dell", price: 1299, blurb: "Compact Windows ultrabook with a sharp display.",
        specs: [["Chip", "Intel Core Ultra 7"], ["Display", "13.4\" OLED"], ["Battery", "~12 hrs"], ["Storage", "512GB"], ["Weight", "1.23kg"]],
        scores: { performance: 7.5, battery: 8, display: 8.5, portability: 9, storage: 7.5, value: 7 } },
      { name: "ASUS ROG Zephyrus G14", brand: "ASUS", price: 1799, blurb: "Gaming power that still fits in a daily bag.",
        specs: [["Chip", "Ryzen 9 + RTX 4070"], ["Display", "14\" QHD, 165Hz"], ["Battery", "~7 hrs"], ["Storage", "1TB"], ["Weight", "1.6kg"]],
        scores: { performance: 9.5, battery: 7, display: 8.5, portability: 7.5, storage: 8, value: 7 } },
      { name: "Lenovo IdeaPad Slim 3", brand: "Lenovo", price: 549, blurb: "Covers the basics without breaking the bank.",
        specs: [["Chip", "Ryzen 5 7530U"], ["Display", "15.6\" FHD"], ["Battery", "~8 hrs"], ["Storage", "512GB"], ["Weight", "1.65kg"]],
        scores: { performance: 5.5, battery: 7, display: 6, portability: 7.5, storage: 6, value: 9 } },
      { name: "Framework Laptop 13", brand: "Framework", price: 999, blurb: "Repairable and upgradeable, built to last.",
        specs: [["Chip", "Core Ultra 5 / 7"], ["Display", "13.5\" 2256x1504"], ["Battery", "~10 hrs"], ["Storage", "512GB, swappable"], ["Weight", "1.3kg"]],
        scores: { performance: 7.5, battery: 7.5, display: 7.5, portability: 7.5, storage: 8.5, value: 8 } },
    ],
  },
};

/* --------------------------- SCORING LOGIC ---------------------------- */

function computeResults(categoryId, useId, picks, budgetId) {
  const cfg = CONFIG[categoryId];
  const budget = cfg.budgets.find((b) => b.id === budgetId) ?? cfg.budgets[cfg.budgets.length - 1];
  const use = cfg.uses.find((u) => u.id === useId);

  const weights = {};
  cfg.priorities.forEach((p) => (weights[p] = 1));
  if (use) Object.entries(use.boost).forEach(([k, v]) => (weights[k] = (weights[k] || 1) + v));
  picks.forEach((p, i) => (weights[p] = (weights[p] || 1) + (3 - i)));

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const pool = cfg.devices.filter((d) => d.price <= budget.max);
  const candidates = pool.length ? pool : cfg.devices;

  const scored = candidates.map((d) => {
    let sum = 0;
    Object.entries(weights).forEach(([k, w]) => {
      sum += (d.scores[k] ?? 5) * w;
    });
    const match = Math.round((sum / totalWeight / 10) * 100);
    return { ...d, match: Math.min(99, Math.max(30, match)) };
  });

  scored.sort((a, b) => b.match - a.match);
  return scored.slice(0, 3);
}

function reasonsFor(device, picks, categoryId) {
  const list = picks.length ? picks : CONFIG[categoryId].priorities.slice(0, 2);
  return list.slice(0, 3).map((key) => {
    const score = device.scores[key] ?? 5;
    const label = PRIORITY_LABELS[key];
    let verdict = "Adequate";
    if (score >= 8.5) verdict = "Excellent";
    else if (score >= 7) verdict = "Strong";
    else if (score >= 5.5) verdict = "Decent";
    return { label, score, verdict };
  });
}

/* ------------------------------- UI ------------------------------------ */

const STEP_NAMES = ["Category", "Purpose", "Priorities", "Budget", "Match"];

export default function DeviceRecommender() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [use, setUse] = useState(null);
  const [picks, setPicks] = useState([]);
  const [budget, setBudget] = useState(null);

  const cfg = category ? CONFIG[category] : null;

  const results = useMemo(() => {
    if (!category || !budget) return [];
    return computeResults(category, use, picks, budget);
  }, [category, use, picks, budget]);

  function reset() {
    setStep(0);
    setCategory(null);
    setUse(null);
    setPicks([]);
    setBudget(null);
  }

  function togglePick(id) {
    setPicks((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 4));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const canProceed =
    (step === 0 && category) ||
    (step === 1 && use) ||
    (step === 2 && picks.length > 0) ||
    (step === 3 && budget) ||
    step === 4;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="min-h-screen bg-[#F1F0EC] text-[#1C1E1B]">
      <style>{`
        .ink { color: #1C1E1B; }
        .leader { position: relative; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
        .leader .lbl { color: #6B6A62; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
        .leader .val { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; white-space: nowrap; }
        .leader::after { content: ""; flex: 1; border-bottom: 1px dotted #C7C4B7; margin-bottom: 4px; }
        .meter { display: flex; gap: 3px; }
        .meter .bar { width: 14px; height: 10px; background: #E3E1D8; }
        .meter .bar.on { background: #2F6F4E; }
        .card-hover:hover { border-color: #1C1E1B; }
        .chip { transition: all 0.12s ease; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#6B6A62] mb-1">Device Match — spec-based recommender</p>
            <h1 className="text-[28px] font-bold tracking-tight">Find the right device</h1>
          </div>
          {step > 0 && (
            <button onClick={reset} className="flex items-center gap-1.5 text-[12px] uppercase tracking-wide text-[#6B6A62] hover:text-[#1C1E1B] border border-[#D8D6CE] px-3 py-1.5">
              <RotateCcw size={12} /> Start over
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-10">
          {STEP_NAMES.map((name, i) => (
            <div key={name} className="flex-1">
              <div className={`h-[3px] mb-1.5 ${i <= step ? "bg-[#2F6F4E]" : "bg-[#E3E1D8]"}`} />
              <p className={`text-[10px] uppercase tracking-wide ${i <= step ? "text-[#1C1E1B]" : "text-[#B4B2A9]"}`}>{name}</p>
            </div>
          ))}
        </div>

        {/* STEP 0: Category */}
        {step === 0 && (
          <div>
            <h2 className="text-[15px] font-bold mb-4">What kind of device are you shopping for?</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`card-hover text-left p-5 border bg-white transition-colors ${active ? "border-[#1C1E1B]" : "border-[#D8D6CE]"}`}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    <p className="font-bold mt-3 text-[15px]">{c.label}</p>
                    <p className="text-[12px] text-[#6B6A62] mt-1">{c.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Primary use */}
        {step === 1 && cfg && (
          <div>
            <h2 className="text-[15px] font-bold mb-1">What will you mainly use it for?</h2>
            <p className="text-[12px] text-[#6B6A62] mb-4">This sets your baseline — you'll fine-tune next.</p>
            <div className="flex flex-col gap-2">
              {cfg.uses.map((u) => {
                const active = use === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setUse(u.id)}
                    className={`chip flex items-center justify-between text-left px-4 py-3 border bg-white ${active ? "border-[#1C1E1B]" : "border-[#D8D6CE]"}`}
                  >
                    <span className="text-[13px]">{u.label}</span>
                    {active && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Priorities */}
        {step === 2 && cfg && (
          <div>
            <h2 className="text-[15px] font-bold mb-1">What matters most to you?</h2>
            <p className="text-[12px] text-[#6B6A62] mb-4">Pick up to 3, in order of importance ({picks.length}/3 selected).</p>
            <div className="flex flex-wrap gap-2">
              {cfg.priorities.map((p) => {
                const idx = picks.indexOf(p);
                const active = idx !== -1;
                return (
                  <button
                    key={p}
                    onClick={() => togglePick(p)}
                    className={`chip flex items-center gap-2 px-4 py-2 border text-[13px] ${active ? "bg-[#1C1E1B] text-white border-[#1C1E1B]" : "bg-white border-[#D8D6CE]"}`}
                  >
                    {active && <span className="font-mono text-[10px]">{idx + 1}</span>}
                    {PRIORITY_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Budget */}
        {step === 3 && cfg && (
          <div>
            <h2 className="text-[15px] font-bold mb-4">What's your budget?</h2>
            <div className="flex flex-col gap-2">
              {cfg.budgets.map((b) => {
                const active = budget === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`chip flex items-center justify-between text-left px-4 py-3 border bg-white ${active ? "border-[#1C1E1B]" : "border-[#D8D6CE]"}`}
                  >
                    <span className="text-[13px]">{b.label}</span>
                    {active && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && (
          <div>
            <h2 className="text-[15px] font-bold mb-1">Your matches</h2>
            <p className="text-[12px] text-[#6B6A62] mb-5">
              Ranked by fit against {picks.map((p) => PRIORITY_LABELS[p]).join(", ")}.
            </p>
            <div className="flex flex-col gap-4">
              {results.map((d, i) => {
                const reasons = reasonsFor(d, picks, category);
                const filledBars = Math.round(d.match / 20);
                return (
                  <div key={d.name} className="bg-white border border-[#D8D6CE] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#6B6A62]">
                          {i === 0 ? "Top match" : `Rank #${i + 1}`} · {d.brand}
                        </p>
                        <p className="text-[18px] font-bold mt-0.5">{d.name}</p>
                        <p className="text-[13px] text-[#6B6A62] mt-1">{d.blurb}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-[20px] font-bold">{d.match}%</p>
                        <div className="meter mt-1 justify-end">
                          {[0, 1, 2, 3, 4].map((n) => (
                            <div key={n} className={`bar ${n < filledBars ? "on" : ""}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#EDEBE3] grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {d.specs.map(([label, val]) => (
                        <div className="leader" key={label}>
                          <span className="lbl">{label}</span>
                          <span className="val">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#EDEBE3]">
                      <p className="text-[10px] uppercase tracking-wide text-[#6B6A62] mb-2">Why it fits</p>
                      <div className="flex flex-col gap-1">
                        {reasons.map((r) => (
                          <p key={r.label} className="text-[13px]">
                            <span className="font-bold">{r.verdict}</span> for {r.label.toLowerCase()}{" "}
                            <span className="font-mono text-[#6B6A62]">({r.score}/10)</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="font-mono text-[15px] font-bold">${d.price.toLocaleString()}</span>
                      <span className="text-[11px] text-[#6B6A62]">Approx. starting price</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#9A988D] mt-5">
              Specs and prices are illustrative approximations for comparison — verify current details before buying.
            </p>
          </div>
        )}

        {/* Nav */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goBack}
              disabled={step === 0}
              className={`flex items-center gap-1.5 text-[12px] uppercase tracking-wide px-4 py-2 border ${step === 0 ? "opacity-30 border-[#D8D6CE]" : "border-[#D8D6CE] hover:border-[#1C1E1B]"}`}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`flex items-center gap-1.5 text-[12px] uppercase tracking-wide px-4 py-2 border ${canProceed ? "bg-[#1C1E1B] text-white border-[#1C1E1B]" : "opacity-30 border-[#D8D6CE]"}`}
            >
              {step === 3 ? "See matches" : "Continue"} <ArrowRight size={13} />
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="flex justify-start mt-8">
            <button onClick={goBack} className="flex items-center gap-1.5 text-[12px] uppercase tracking-wide px-4 py-2 border border-[#D8D6CE] hover:border-[#1C1E1B]">
              <ArrowLeft size={13} /> Adjust budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
