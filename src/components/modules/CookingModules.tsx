import { Icon } from '../scenes/Icons';
import { EmptyState } from './EmptyState';
import { RECIPES, COOK_VIDEOS } from '../../data/scene-data';

export function TonightHero({ size = "large" }: { size?: string }) {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "40ms" }}>
      <div className="flex flex-col items-center justify-center gap-2.5" style={{ minHeight: size === "large" ? 120 : 80 }}>
        <Icon name="chef" size={20} className="text-muted" />
        <div className="font-mono text-muted" style={{ fontSize: "11px" }}>No recipe planned</div>
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
  return <EmptyState icon="shopping-cart" message="No grocery list" delay="180ms" />;
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
  return <EmptyState icon="utensils" message="No meal plan set" delay="160ms" />;
}
