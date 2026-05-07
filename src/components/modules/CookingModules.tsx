import { Icon } from '../scenes/Icons';
import { TONIGHT, RECIPES, GROCERIES, COOK_VIDEOS } from '../../data/scene-data';

export function TonightHero({ size = "large" }: { size?: string }) {
  const t = TONIGHT;
  return (
    <div className="module warm p-0 overflow-hidden module-enter" style={{ animationDelay: "40ms" }}>
      <div className="grid" style={{ gridTemplateColumns: size === "large" ? "1.05fr 1fr" : "1fr" }}>
        <div className="relative" style={{
          minHeight: size === "large" ? 280 : 200,
          background: `repeating-linear-gradient(135deg, rgba(120,55,25,0.85) 0 16px, rgba(160,75,35,0.85) 16px 32px), linear-gradient(180deg, #d97a3a, #6e2d12)`,
        }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(255,210,150,0.35), transparent 60%)" }} />
          <div className="absolute" style={{ left: 16, top: 16 }}>
            <span className="chip" style={{ background: "rgba(0,0,0,0.35)", borderColor: "rgba(255,220,180,0.3)", color: "#ffe8c8" }}>Tonight · 5:45 PM start</span>
          </div>
          <div className="absolute font-mono uppercase" style={{ left: 16, bottom: 16, right: 16, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,220,180,0.7)" }}>
            [ hero plate · braise + polenta ]
          </div>
        </div>
        <div className="p-5 flex flex-col">
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em", color: "#caa67a" }}>Tonight's plan</div>
          <div className="font-serif leading-tight mt-1.5" style={{ fontSize: "28px", lineHeight: 1.15, color: "#f3e6d3" }}>{t.title}</div>
          <div className="italic mt-1" style={{ fontSize: "12.5px", color: "#caa67a", fontFamily: "var(--serif)" }}>{t.source}</div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div><div className="font-mono text-muted uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Prep</div><div className="font-serif" style={{ fontSize: "20px" }}>{t.prep}m</div></div>
            <div><div className="font-mono text-muted uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Cook</div><div className="font-serif" style={{ fontSize: "20px" }}>{Math.floor(t.cook / 60)}h {t.cook % 60}m</div></div>
            <div><div className="font-mono text-muted uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Serves</div><div className="font-serif" style={{ fontSize: "20px" }}>{t.serves}</div></div>
          </div>

          <div className="leading-relaxed mt-3" style={{ fontSize: "12.5px", color: "rgba(243,230,211,0.85)" }}>{t.note}</div>

          <div className="flex items-center gap-2 mt-auto" style={{ paddingTop: 16 }}>
            <button aria-label="Start cooking mode" className="font-mono rounded-md" style={{ fontSize: "11px", padding: "6px 12px", background: "#d97a3a", color: "#1a1410" }}>Start cooking mode</button>
            <button aria-label="Open recipe" className="font-mono rounded-md hairline" style={{ fontSize: "11px", padding: "6px 12px" }}>Recipe ↗</button>
            <button aria-label="Play kitchen playlist" className="font-mono rounded-md hairline" style={{ fontSize: "11px", padding: "6px 12px" }}>Kitchen playlist ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecipeShelf() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "140ms" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Saved · recently</div>
        <button aria-label="View all saved recipes" className="font-mono text-muted" style={{ fontSize: "10.5px" }}>All ↗</button>
      </div>
      <div className="space-y-2.5">
        {RECIPES.map((r, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className="rounded-md flex-none" style={{
              width: 36, height: 36,
              background: i % 4 === 0 ? "linear-gradient(135deg,#a4533c,#5a2616)"
                : i % 4 === 1 ? "linear-gradient(135deg,#9a3b3b,#3a1010)"
                : i % 4 === 2 ? "linear-gradient(135deg,#8a8c4a,#3a3c1c)"
                : "linear-gradient(135deg,#c08a4a,#5a3818)",
            }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium font-serif leading-tight truncate" style={{ fontSize: "13px" }}>{r.title}</div>
              <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{r.src} · {r.min}m · saved {r.saved}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroceriesModule() {
  const need = GROCERIES.filter(g => !g.x);
  const have = GROCERIES.filter(g => g.x);
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "180ms" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Grocery list · for tonight</div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{need.length} to get</div>
      </div>
      <div className="space-y-1.5">
        {need.map((g, i) => (
          <div key={i} className="flex items-center gap-2.5" style={{ fontSize: "13px" }}>
            <span className="rounded-sm hairline" style={{ width: 14, height: 14 }} />
            <span>{g.t}</span>
          </div>
        ))}
        {have.map((g, i) => (
          <div key={i} className="flex items-center gap-2.5 text-muted line-through" style={{ fontSize: "13px" }}>
            <span className="rounded-sm" style={{ width: 14, height: 14, background: "rgba(180,140,90,0.6)" }} />
            <span>{g.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CookingVideos() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "220ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="video" size={14} />
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Watch while cooking</div>
      </div>
      <div className="space-y-2.5">
        {COOK_VIDEOS.map((v, i) => (
          <div key={i} className="flex gap-3">
            <div className="rounded flex-none relative overflow-hidden" style={{
              width: 68, height: 40,
              background: i === 0 ? "linear-gradient(135deg,#3a2a18,#0c0805)" : i === 1 ? "linear-gradient(135deg,#52301a,#1a0a04)" : "linear-gradient(135deg,#5e3520,#1f0d05)",
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="play" size={14} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-tight" style={{ fontSize: "12px" }}>{v.title}</div>
              <div className="font-mono text-muted mt-0.5" style={{ fontSize: "10.5px" }}>{v.ch} · {v.dur}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeasonalNote() {
  return (
    <div className="module p-4 module-enter warm" style={{ animationDelay: "260ms" }}>
      <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em", color: "#caa67a" }}>Seasonal · spring</div>
      <div className="font-serif italic leading-tight mt-1.5" style={{ fontSize: "18px", color: "#f3e6d3" }}>
        Asparagus is in. So are ramps if you can find them. Lean lighter on the braises by next week.
      </div>
    </div>
  );
}

export function WeekendMealPlan() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "160ms" }}>
      <div className="font-mono uppercase text-muted mb-3" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Weekend menu</div>
      <div className="space-y-2.5">
        {[
          { day: "Sat brunch", what: "Buttermilk pancakes, bacon, soft eggs", chip: "easy" },
          { day: "Sat dinner", what: "Grilled spatchcock chicken, charred lemon", chip: "grill" },
          { day: "Sun brunch", what: "Frittata — leftover greens & gruyère", chip: "clean-out" },
          { day: "Sun dinner", what: "Short ribs over polenta", chip: "main event" },
        ].map((m, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <div className="font-mono uppercase text-muted flex-none" style={{ fontSize: "10px", letterSpacing: "0.05em", width: 80 }}>{m.day}</div>
            <div className="font-serif flex-1" style={{ fontSize: "13px" }}>{m.what}</div>
            <span className="chip">{m.chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
